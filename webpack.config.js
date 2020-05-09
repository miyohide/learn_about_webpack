const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    main: './src/index.js',
    pageA: './src/pageA.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath,
  },
  devServer: {
    contentBase: outputPath
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
                  {
                    useBuiltIns: 'usage',
                    corejs: 3
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
};
