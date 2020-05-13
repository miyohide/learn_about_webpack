const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const outputPath = path.resolve(__dirname, 'dist')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    contentBase: outputPath
  }
})
