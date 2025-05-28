const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/games', async (req, res) => {
  try {
    const games = await Game.find()
      .populate('players', 'username avatar') // pour afficher pseudo et avatar
      .sort({ playedAt: -1 }); // les plus récentes d’abord

    res.json(games);
  } catch (err) {
    console.error('Erreur lors de la récupération des parties :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
