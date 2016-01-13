var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync').create();

var htmlSources = ['*.html'],
	sassSources = ['sass/*.scss'],
	jsSources = ['js/*.js'];

var onError = function(err){
	gutil.beep();
	console.log(err);
	this.emit('end');
};

gulp.task('html', function(){
	gulp.src(htmlSources)
		.pipe(browserSync.stream());
});

gulp.task('compass', function(){
	gulp.src(sassSources)
		.pipe(plumber({errorHandler: onError}))
		.pipe(compass({
			sass: 'sass/',
			image: 'img/',
			style: 'expanded'
		}).on('error', gutil.log))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	gulp.src(jsSources)
		.pipe(plumber({errorHandler: onError}))
		.pipe(browserify())
		.pipe(browserSync.stream());
});

gulp.task('serve', ['compass'], function(){
	browserSync.init({
		server: '',
		notify: false
	});
});

gulp.task('watch', function(){
	gulp.watch(htmlSources, ['html']).on('change', browserSync.reload);
	gulp.watch(sassSources, ['compass']);
	gulp.watch(jsSources, ['js']);
});

gulp.task('default', ['watch', 'html', 'compass', 'js', 'serve']);