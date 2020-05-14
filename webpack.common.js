const path = require('path');
const glob = require('glob');
const outputPath = path.resolve(__dirname, 'dist');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var entries = {};

glob.sync('./src/*.js').forEach(v => {
  let key = v.replace('./src/', '');
  entries[key] = v;
});

module.exports = {
  entry: entries,
  output: {
    filename: '[name]',
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      name: 'vendor.js',
      chunks: 'initial'
    }
  }
};
