#!/usr/bin/env node

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: {
    'background': './src/background.js',
    'content-script': './src/content-script.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json'
        },
        // Copy icons (keeping them in root as referenced by manifest)
        {
          from: './*.png',
          to: '[name][ext]',
          noErrorOnMissing: true
        }
      ]
    })
  ],
  resolve: {
    alias: {
      'shadow-dom-selector': path.resolve(__dirname, 'node_modules/shadow-dom-selector/dist/index.js')
    }
  }
};
