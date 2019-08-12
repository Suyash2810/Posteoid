const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
var path = require('path');

var compress = async (imageURL, callback) => {

    const files = await imagemin([`public${imageURL}`], {
        destination: path.resolve(__dirname, '..', 'public/build/userImagesCompressed'),
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.4, 0.4]
            })
        ]
    });

    console.log(files);
    callback(files);
}


module.exports = {
    compress
}