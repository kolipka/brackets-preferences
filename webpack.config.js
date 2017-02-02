/* global require, module, __dirname */
'use strict';
const path = require('path');

module.exports = {
  entry: {
    bundle: './src/main.js',
    polyfill: 'babel-polyfill'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    library: 'dist/[name]',
    libraryTarget: 'amd'
  },
  externals: {
    strings: true
  },
  module: {
    preloader: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ }
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          'babel-loader?presets=es2015',
          'redom/dist/jsx-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  eslint: {
    configFile: '.eslintrc.js',
    fix: true,
    plugins: [
      'react'
    ]
  }
};
