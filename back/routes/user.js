var express = require('express');
var app = express.Router();

const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

var mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

var authenticateJWT = require('../tools/auth.js')

// ✅ Route : Créer un utilisateur avec un avatar prédéfini
app.post('/signin', async (req, res) => {
    const { username, email, password, avatar } = req.body;

    try {
        const userCreated = await User.create({ username, email, password, avatar });
        res.status(201).json(userCreated);
    } catch (e) {
        console.error(e);
        res.status(403).send('Wrong datas');
    }
});


app.post('/login', async (req, res) => {
    // On récupère le username et password
    const { email, password } = req.body;

    // On cherche l'utilisateur qui correspond
	const user = await User.findOne({email: email, password: password})
    console.log(user);
    if (user) {
        // On génère le token
        const accessToken = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.TOKEN_SECRET);
        console.log(accessToken)
        var io = req.app.get('socketio');
        io.emit('new login', `new user connected : ${user.email}`);
        res.json({
            accessToken
        });
    } else {
        res.status(403).send('Wrong email or password');
    }
});

const adminPermission = (req, res, next) => {
    const { role } = req.user;

	if (role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
}

app.get('/profile/:id', [authenticateJWT, adminPermission], async (req, res) => {
	const id = req.params.id;
	const user = await User.findOne({_id: ObjectID(id)});
    res.json(user);
});

app.get('/profile', authenticateJWT, async (req, res) => {
	const user = await User.findOne({email: req.user.email});
    res.json(user);
});




module.exports = app;