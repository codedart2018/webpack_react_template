const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: 'js/[name].[hash:8].bundle.js'
  },
  watch: true,
  watchOptions: {
    //忽略不用监听变更的目录
    ignored: /node_modules/,
    //防止重复保存频繁重新编译,500毫米内重复保存不打包
    aggregateTimeout: 500,
    //每秒询问的文件变更的次数
    poll: 5
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    port: 9520,
    compress: true,
    inline: true,
    hot: true,
    //当有编译错误或者警告的时候显示一个全屏overlay
    overlay: {
      errors: true,
      warnings: true
    },
    //跨域代理
    proxy: {
      '/common': {
        target: 'http://nkw.pc.cn/',
        changeOrigin: true
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      //模板
      template: 'public/index.html',
      //插入位置
      inject: 'body',
      //防止缓存
      hash: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    //用户名替代id,更新组件时在控制台输出组件的路径而不是数字ID，用在开发模式
    new webpack.NamedModulesPlugin()
  ],
  performance: {
    hints: 'warning',
    // 整数类型（以字节为单位）
    maxAssetSize: 30000000,
    // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000,
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  }
});
