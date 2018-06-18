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
const Asset = require('../models/asset');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

//insert data into mongo
function seedAssetData() {
	console.info('seeding AssetData');
	const seedData = [];

	for (let i = 1; i <= 10; i++) {
	seedData.push(generateAssetData());
	}
	return Asset.insertMany(seedData);
}

//insert data into mongo
const testUsername = faker.random.word() + faker.random.number();

function generateUserData() {
	return {
		email: `${testUsername}@${faker.random.word()}.com`,
		password: faker.random.word()
	}
}

function generateAssetName() {
	const assetName = ['SP 500','Cash','Real Estate','Total Bond','Dividend Yield'];
	return assetName[Math.floor(Math.random() * assetName.length)];
}

function generateCurrentValue() {
	const currentValue = [10, 100, 9999, 120120, 1000000];
	return currentValue[Math.floor(Math.random() * currentValue.length)];
}

function generateTargetPercentage() {
	const target = [10, 20, 50, 100];
	return target[Math.floor(Math.random() * target.length)];
}
//Generate objects representing a Asset
//for seed data or req.body data
function generateAssetData() {
	return {
		name: generateAssetName(),
		value: generateCurrentValue(),
		target: generateTargetPercentage(),
		user: testUsername
	};
}

//delete entire database
//ensure data does not stick around for next one
function tearDownDb() {
/*	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
		  .then(result => resolve(result))
		  .catch(err => reject(err));*/
/*	});*/
}


//hook functions to return a promise
// before and after functions
describe('API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedAssetData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

  //GET
	describe('GET ENDPOINT', function() {
		it('should return all portfolio assets', function() {
			let res;
			return chai.request(app)
				.get(`/asset/get/${testUsername}`)
				.then(function(_res) {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.have.length.of.at.least(1);
					return Asset.count();
				})
		.then(function(count) {
				expect(res.body).to.have.length.of(count);
		});
    });

		it('should return assets with the right fields', function() {
			let resAsset;
			return chai.request(app)
				.get(`/asset/get/${testUsername}`)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('array');
					expect(res.body).to.have.length.of.at.least(1);

				res.body.forEach(function (asset) {
				    expect(asset).to.be.a('object');
				    expect(asset).to.include.keys('_id','__v' ,'name', 'value', 'target', 'user');
				});
			resAsset = res.body[0];
			return Asset.findById(resAsset.id)
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

    //POST Create New Asset
	describe('POST ENDPOINT', function() {
		it('should add new a asset', function() {
			const newAsset = generateAssetData();
			return chai.request(app)
				.post('/asset/create')
				.send(newAsset)
				.then(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('_id','__v' ,'name', 'value', 'target', 'user');
					expect(res.body.name).to.equal(newAsset.name);
					expect(res.body.user).to.equal(newAsset.user);
					expect(parseInt(res.body.value)).to.equal(newAsset.value);
					expect(parseInt(res.body.target)).to.equal(newAsset.target);
					expect(res.body._id).to.not.be.null;
				});
		});
	});
	//PUT UPDATE ASSET BY ID
	describe('PUT endpoint', function() {
		it('should update fields sent over', function() {
			const updateData = {
				name: 'Tesla Stock',
				value: 9000, 
				target: 99
		};

		return Asset
			.findOne()
			.then( function(asset) {
				updateData.id = asset.id;
				return chai.request(app)
					.put(`/asset/${asset.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Asset.findById(updateData.id);
			})
			.then(function(asset) {
				expect(asset.name).to.equal(updateData.name);
				expect(parseInt(asset.value)).to.equal(updateData.value);
				expect(parseInt(asset.target)).to.equal(updateData.target);
			});
		});
	});			
	//DELETE ASSET
	describe('DELETE endpoint', function () {
		it('should delete a post by id', function () {
			let asset;
			return Asset
				.findOne()
				.then(_asset => {
					asset = _asset;
					return chai.request(app).delete(`/asset/delete/${asset.id}`);
		})
		.then(res => {
			res.should.have.status(204);
			return Asset.findById(asset.id);
		})
		.then(_asset => {
			should.not.exist(_asset);
		});
	});
});
});
});  