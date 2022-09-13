let argv = require('minimist')(process.argv.slice(2));

const {blendPhotos} = require('./catAsService');

/**
 * Blend Two Photos from Catass images
 */
blendPhotos(argv);