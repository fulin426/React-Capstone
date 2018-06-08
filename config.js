exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://admin:admin@ds135252.mlab.com:35252/portfolio-tracker';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
    'mongodb://admin:admin@ds135252.mlab.com:35252/portfolio-tracker';
exports.PORT = process.env.PORT || 8080;