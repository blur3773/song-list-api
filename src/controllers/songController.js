const fs = require('fs');
const path = require('path');
const songsFilePath = path.join(__dirname, '../data/songs.json');

// Получить все песни
const getAllSongs = (req, res) => {
    const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));
    res.json(songs);
};

// Получить одну песню по ID
const getSongById = (req, res) => {
    const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));
    const song = songs.find(s => s.id == req.params.id);
    if (!song) return res.status(404).json({ error: 'Песня не найдена' });
    res.json(song);
};

// Добавить новую песню
const addSong = (req, res) => {
    const { title, artist, genre, year } = req.body;
    if (!title || !artist) {
        return res.status(400).json({ error: 'Название и исполнитель обязательны' });
    }

    const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));
    const newSong = {
        id: songs.length + 1,
        title,
        artist,
        genre: genre || 'Unknown',
        year: year || null
    };
    songs.push(newSong);
    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2));
    res.status(201).json(newSong);
};

// Обновить песню
const updateSong = (req, res) => {
    const { title, artist, genre, year } = req.body;
    const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));
    const index = songs.findIndex(s => s.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Песня не найдена' });

    songs[index] = {
        ...songs[index],
        title: title || songs[index].title,
        artist: artist || songs[index].artist,
        genre: genre || songs[index].genre,
        year: year !== undefined ? year : songs[index].year
    };

    fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2));
    res.json(songs[index]);
};

// Удалить песню
const deleteSong = (req, res) => {
    const songs = JSON.parse(fs.readFileSync(songsFilePath, 'utf-8'));
    const filtered = songs.filter(s => s.id != req.params.id);
    if (filtered.length === songs.length) {
        return res.status(404).json({ error: 'Песня не найдена' });
    }

    fs.writeFileSync(songsFilePath, JSON.stringify(filtered, null, 2));
    res.status(204).send();
};

module.exports = {
    getAllSongs,
    getSongById,
    addSong,
    updateSong,
    deleteSong
};