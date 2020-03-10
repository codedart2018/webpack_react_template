const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat'); // 合并文件
const autoPreFixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css'); // 压缩css
const sass = require('gulp-sass'); // sass编译
const del = require('del'); // 清空目录
//目录处理
const DIR = {
  scss: path.resolve(__dirname, '../src/styles/*.scss'),
  dist: path.resolve(__dirname, '../dist')
};

// clean任务，清空dist目录
gulp.task('clean', async () => {
  await del([DIR.dist], {force: true});
});

// sass任务，实现scss文件编译、合并、压缩
gulp.task('sass', async () => {
  await gulp.src(DIR.scss)
    // sass编译
    .pipe(sass())
    .pipe(autoPreFixer('last 3 version', 'safari 5', 'ie 8', 'ie 9'))
    // .pipe(concat('scss.css')) // 合并为scss.css
    .pipe(cleanCss()) // 压缩css文件
    .pipe(gulp.dest(DIR.dist));
});

// 先执行clean任务，再并行执行sass和css任务
gulp.task('default', gulp.series('clean', gulp.parallel('sass')));