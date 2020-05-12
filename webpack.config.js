const path = require('path');
const glob = require('glob');
const outputPath = path.resolve(__dirname, 'dist');
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
  devServer: {
    contentBase: outputPath
  },
  devtool: 'eval-source-map',
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
  optimization: {
    splitChunks: {
      name: 'vendor.js',
      chunks: 'initial'
    }
  }
};
