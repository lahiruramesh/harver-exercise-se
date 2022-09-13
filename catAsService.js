
const axios = require('axios');
const {config} = require('./config');
let { join } = require('path');
let { writeFile } = require('fs');
const blend = require('@mapbox/blend');

/**
 * 
 * @param {object} argv 
 * @param {string} requestType 
 * @returns {object}
 */
const fetchFromCatAsService = async (argv, requestType) => {
    let url  = createUrl(argv, requestType);
    const response = await axios.get(url, { responseType: 'arraybuffer'});
    console.log(requestType, response.status);
    return response;
}

/**
 * 
 * @param {object} argv 
 * @param {string} requestType 
 * @returns {string}
 */
const createUrl = (argv, requestType) => {
    let url = config.catAsServiceBaseUrl;
    let {
        greeting = 'Hello', who = 'You',
        width = 400, height = 500, color = 'Pink', size = 100,
    } = argv;
    
    if(requestType === config.requestType.first) {
        url += greeting + '?width=' + width + '&height=' + height + '&color=' + color + '&s=' + size;
    }else{
        url += who + '?width=' + width + '&height=' + height + '&color=' + color + '&s=' + size;
    }
    return url;
}

/**
 * 
 * @param {object} argv 
 */
const blendPhotos = async (argv) => {
    let { width = 400, height = 500} = argv;
    const firstBody =  await fetchFromCatAsService(argv, 'first');
    const secondBody =  await fetchFromCatAsService(argv, 'second');

    blend([ 
        { buffer: Buffer.from(firstBody.data, 'binary'), x: 0, y:0 }, 
        { buffer: Buffer.from(secondBody.data, 'binary'), x: width, y: 0 }
    ], 
    { width: width * 2, height: height, format: 'jpeg', }, 
    (err, data) => {
        console.log('err', err);
        const fileOut = join(process.cwd(), `/cat-card.jpg`);
        
        writeFile(fileOut, data, 'binary', (err) => { if(err) {
            console.log(err);
            return; 
        }
        
        console.log("The file was saved!"); 
    }
    );
    }); 
}

module.exports = {blendPhotos};