module.exports = {
  plugins: [
    // 自动添加css前缀
    require('autoprefixer')({overrideBrowserslist: ['> 0.15% in CN']})
  ]
};