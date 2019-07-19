const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var url = 'mongodb://localhost:27017/myproject';
mongoose.connect(url);