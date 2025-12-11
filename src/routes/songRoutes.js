const express = require('express');
const router = express.Router();
const {
    getAllSongs,
    getSongById,
    addSong,
    updateSong,
    deleteSong
} = require('../controllers/songController');

router.get('/', getAllSongs);
router.get('/:id', getSongById);
router.post('/', addSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

module.exports = router;