const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pkg = require('../package.json');

module.exports = merge(common, {
  mode: 'production',
  //如果对象或数组出口为单文件会报错
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'tania.js',
    //类库名称
    library: 'taniaUi',
    //类库加载方式
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new MiniCssExtractPlugin({filename: 'css/tania.css'}),
    //注释头信息
    new webpack.BannerPlugin(pkg.name + ' v' + pkg.version + ' by ' + pkg.author + ' (c) ' + new Date().getFullYear() + ' Licensed ' + pkg.license)
  ],
  optimization: {
    minimizer: [
      //压缩js
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        extractComments: 'all'
        // extractComments: false,
      }),
      //压缩css
      new OptimizeCSSAssetsPlugin({
        //正则表达式，用于匹配需要优化或者压缩的资源名。默认值是 /.css$/g
        assetNameRegExp: /\.css$/g,
        //用于压缩和优化CSS 的处理器，默认是 cssnano.
        cssProcessor: require('cssnano'),
        //传递给cssProcessor的插件选项，默认为{}
        cssProcessorPluginOptions: {
          preset: ['default', {discardComments: {removeAll: true}}]
        },
        //表示插件能够在console中打印信息，默认值是true
        canPrint: true
      })
    ]
  },
  //排除第三方包打包
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'react-router-dom': {
      root: 'ReactRouterDOM',
      commonjs2: 'react-router-dom',
      commonjs: 'react-router-dom',
      amd: 'react-router-dom'
    }
  }
});
