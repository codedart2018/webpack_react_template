const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    //输出名称 [hash]或[chunkhash]
    filename: 'js/[name].[chunkhash:8].bundle.js'
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
    new HtmlWebpackPlugin({
      //打包后名字
      filename: 'index.html',
      // 这里有小伙伴可能会疑惑为什么不是 '../public/index.html'
      // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: 'public/index.html',
      //插入地方
      inject: 'body',
      minify: {
        //去除注释
        removeComments: true,
        //去空格
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        framework: {
          test: 'framework',
          name: 'framework',
          enforce: true
        },
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: 'vendor',
          enforce: true
        }
      }
    },
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
  // performance: {
  //   hints: 'warning', // 枚举
  //   maxAssetSize: 30000000, // 整数类型（以字节为单位）
  //   maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
  //   assetFilter: function (assetFilename) {
  //     // 提供资源文件名的断言函数
  //     return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
  //   }
  // }
});
