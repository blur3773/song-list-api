let allSongs = [];
let currentFilter = 'all';

// Загрузка песен
async function loadSongs() {
    try {
        const res = await fetch('/api/songs');
        allSongs = await res.json();
        renderSongs(allSongs);
        updateStats();
    } catch (error) {
        console.error('Ошибка загрузки песен:', error);
    }
}

// Рендер песен
function renderSongs(songs) {
    const container = document.getElementById('songs');
    container.innerHTML = songs.map((song, index) => `
        <div class="song-card" style="animation-delay: ${index * 0.05}s">
            <img src="${song.cover || 'https://via.placeholder.com/300x180?text=No+Cover'}" 
                 alt="${song.album}" 
                 class="album-cover"
                 onerror="this.src='https://via.placeholder.com/300x180?text=No+Cover'">
            <div class="song-info">
                <h3>${song.title}</h3>
                <p class="artist">${song.artist}</p>
                <div class="genre-year">
                    <span class="genre">🎵 ${song.genre}</span>
                    <span class="year">📅 ${song.year}</span>
                </div>
                <p class="duration">⏱️ ${song.duration} • ${song.album}</p>
                <button class="delete-btn" onclick="deleteSong(${song.id})">
                    🗑️ Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Фильтрация по жанру
function filterSongs(genre) {
    currentFilter = genre;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.genre === genre);
    });
    
    const filtered = genre === 'all' 
        ? allSongs 
        : allSongs.filter(song => song.genre.toLowerCase().includes(genre.toLowerCase()));
    
    renderSongs(filtered);
}

// Добавление песни
async function addSong(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const duration = document.getElementById('duration').value;
    const album = document.getElementById('album').value;
    const cover = document.getElementById('cover').value;

    if (!title || !artist) {
        alert('Название и исполнитель обязательны!');
        return;
    }

    try {
        const res = await fetch('/api/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                artist, 
                genre: genre || 'Unknown',
                year: year || new Date().getFullYear(),
                duration: duration || '3:00',
                album: album || 'Single',
                cover: cover || ''
            })
        });

        if (res.ok) {
            // Очистка формы
            event.target.reset();
            // Перезагрузка песен
            await loadSongs();
            // Показать уведомление
            showNotification('🎵 Песня успешно добавлена!');
        }
    } catch (error) {
        console.error('Ошибка добавления:', error);
    }
}

// Удаление песни
async function deleteSong(id) {
    if (!confirm('Удалить эту песню?')) return;
    
    try {
        const res = await fetch(`/api/songs/${id}`, { 
            method: 'DELETE' 
        });
        
        if (res.ok) {
            await loadSongs();
            showNotification('🗑️ Песня удалена');
        }
    } catch (error) {
        console.error('Ошибка удаления:', error);
    }
}

// Обновление статистики
function updateStats() {
    const totalSongs = document.getElementById('totalSongs');
    const totalArtists = document.getElementById('totalArtists');
    const oldestYear = document.getElementById('oldestYear');
    const newestYear = document.getElementById('newestYear');
    
    if (allSongs.length === 0) {
        totalSongs.textContent = '0';
        totalArtists.textContent = '0';
        oldestYear.textContent = '-';
        newestYear.textContent = '-';
        return;
    }
    
    // Уникальные исполнители
    const uniqueArtists = new Set(allSongs.map(song => song.artist));
    
    // Годы
    const years = allSongs.map(song => song.year).filter(y => y);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    totalSongs.textContent = allSongs.length;
    totalArtists.textContent = uniqueArtists.size;
    oldestYear.textContent = minYear !== Infinity ? minYear : '-';
    newestYear.textContent = maxYear !== -Infinity ? maxYear : '-';
}

// Показать уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00ffcc, #00b8ff);
        color: #1a1a2e;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadSongs();
    
    // Обработка формы
    document.getElementById('addForm').addEventListener('submit', addSong);
    
    // Стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});