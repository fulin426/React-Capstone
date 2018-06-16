"use strict";

const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: false},
    favorites1: {
        type: String,
        required: false},
    favorites2: {
        type: String,
        required: false},
	favorites3: {
		type: String,
		required: false},
    favorites4: {
        type: String,
        required: false},
    favorites5: {
        type: String,
        required: false}
});

const Favorites = mongoose.model('favorites', favoritesSchema);

module.exports = Favorites;