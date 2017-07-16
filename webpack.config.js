const Webpack = require('webpack');
const Path = require('path');

module.exports = {
    entry: Path.join(__dirname, 'static', 'js', 'index.js'),
    output: {
        path: Path.join(__dirname, 'static'),
        filename: 'bundle.js'
    }
};
