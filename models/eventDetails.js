"use strict";

const mongoose = require('mongoose');

const eventDetailSchema = new mongoose.Schema({
    date: {
        type: String,
        required: false},
	time: {
		type: String,
		required: false},
    venueName: {
        type: String,
        required: false},
    eventName: {
        type: String,
        required: false},
    city: {
        type: String,
        required: false},
    eventurl: {
        type: String,
        required: false},
    venueurl: {
        type: String,
        required: false}

});

const eventDetail = mongoose.model('eventDetail', eventDetailSchema);

module.exports = eventDetail;