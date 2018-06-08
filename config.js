exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 
'mongodb://admin:admin12@ds151970.mlab.com:51970/react-capstone';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
'mongodb://test123:test123@ds241019.mlab.com:41019/restaurants-app-test';

exports.PORT = process.env.PORT || 8080;