const path = require('path');
const dev = Boolean(process.env.WEBPACK_SERVE);

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './site/index.js',
    // framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        //排除node_modules文件夹
        exclude: /node_modules/
      },
      //处理图片
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192
          }
        }
      },
      //处理图标
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  performance: {
    hints: dev ? false : 'warning'
  }
};