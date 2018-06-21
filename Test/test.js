'use strict';
//Setup
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

//expect syntax in module
const expect = chai.expect;
const should = chai.should();

const { DATABASE_URL, PORT } = require('../config');
const { TEST_DATABASE_URL } = require('../config');
const Favorites = require('../models/favorites');
const EventDetail = require('../models/eventDetails');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

//insert data into mongo
function seedEventData() {
	console.info('seeding EventData');
	const seedData = [];

	for (let i = 1; i <= 10; i++) {
	seedData.push(generateEventData());
	}
	return EventDetail.insertMany(seedData);
}

//insert data into mongo
const testUsername = faker.random.word() + faker.random.number();

function generateUserData() {
	return {
		email: `${testUsername}@${faker.random.word()}.com`,
		password: faker.random.word()
	}
}

function generateDate() {
	const date = ['2018-06-24','2018-08-24','2020-01-30','2404-012-30','3030-03-03'];
	return date[Math.floor(Math.random() * date.length)];
}

function generateTime() {
	const time = ['10:30:00', '12:00:00', '24:30:00', '15:15:15', '08:15:00'];
	return time[Math.floor(Math.random() * time.length)];
}

function generateVenue() {
	const venue = ['Fox Theatre', 'Pheonix Theatre', 'Warfield', 'Oracle', 'Red Rocks'];
	return venue[Math.floor(Math.random() * venue.length)];
}

function generateEventName() {
	const venue = ['Ultra', 'EDC', 'Coachella', 'Electric Forest', 'Burning Man'];
	return venue[Math.floor(Math.random() * venue.length)];
}

function generateCity() {
	const venue = ['Boulder, CO', 'Las Vegas, NV', 'NYC', 'Dallas, TX', 'Oakland, CA'];
	return venue[Math.floor(Math.random() * venue.length)];
}

//Generate objects representing a Event
//for seed data or req.body data
function generateEventData() {
	return {
		user: testUsername,
		date: generateDate(),
		time: generateTime(),
		venueName: generateVenue(),
		eventName: generateEventName(),
		city: generateCity()
	};
}

//delete entire database
//ensure data does not stick around for next one
function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
		  .then(result => resolve(result))
		  .catch(err => reject(err));
	});
}


//hook functions to return a promise
// before and after functions
describe('API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedEventData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

  //GET
	describe('GET ENDPOINT', function() {
		it('should return all saved events', function() {
			let res;
			return chai.request(app)
				.get(`/event/get/${testUsername}`)
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.have.length.of.at.least(1);
					return EventDetail.count();
				})
		.then(function(count) {
				expect(res.body).to.have.length.of(count);
		});
    });

		it('should return events with the right fields', function() {
			let resEvent;
			return chai.request(app)
				.get(`/event/get/${testUsername}`)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
					expect(res.body).to.have.length.of.at.least(1);
				res.body.forEach(function (event) {
				    expect(event).to.be.a('object');
				    expect(event).to.include.keys('_id', '__v','user', 'date', 'time', 'venueName', 'city', 'eventName');
				});
			resEvent = res.body[0];
			return EventDetail.findById(resEvent.id)
			});
		});

  //POST Create New User
	describe('POST ENDPOINT', function() {
		it('should add new a user', function() {
			const newUser = generateUserData();
			return chai.request(app)
				.post('/users/create')
				.send(newUser)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('email', 'password', '_id');
					expect(res.body.email).to.equal(newUser.email);
					expect(res.body._id).to.not.be.null;
				});
		});
	});

    //POST Create New Event
	describe('POST ENDPOINT', function() {
		it('should add new a event listing', function() {
			const newEvent = generateEventData();
			return chai.request(app)
				.post('/event/create')
				.send(newEvent)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('_id', '__v','user', 'date', 'time', 'venueName', 'city', 'eventName');
					expect(res.body.time).to.equal(newEvent.time);
					expect(res.body.user).to.equal(newEvent.user);
					expect(res.body.venueName).to.equal(newEvent.venueName);
					expect(res.body.eventName).to.equal(newEvent.eventName);
					expect(res.body._id).to.not.be.null;
				});
		});
	});
	//PUT UPDATE artists BY ID
/*	describe('PUT endpoint', function() {
		it('should update top 5 artists', function() {
			const updateData = {
				favorites1: 'TLC',
				favorites3: 'Johnny B Good', 
				favorites4: 'Kanye West'
		};

		return Favorites
			.findOne()
			.then(function(favorites) {
				console.log(favorites.id);
				updateData.id = favorites.id;
				return chai.request(app)
					.put(`/event/topartists/${favorites.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Favorites.findById(updateData.id);
			})
/*			.then(function(favorites) {
				expect(favorites.name).to.equal(updateData.name);
				expect(parseInt(favorites.value)).to.equal(updateData.value);
				expect(parseInt(favorites.target)).to.equal(updateData.target);*/
/*			});
		});
	});		*/	
	//DELETE Favorite artist
	describe('DELETE endpoint', function () {
		it('should delete a Event by id', function () {
			let event;
			return EventDetail
				.findOne()
				.then(_event => {
					event = _event;
					return chai.request(app).delete(`/event/delete/${event.id}`);
		})
		.then(res => {
			res.should.have.status(204);
			return Favorites.findById(event.id);
		})
		.then(_event => {
			should.not.exist(_event);
		});
	});
});
});
});  