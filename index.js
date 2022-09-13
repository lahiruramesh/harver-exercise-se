let argv = require('minimist')(process.argv.slice(2));

const {blendPhotos} = require('./catAsService');

blendPhotos(argv);