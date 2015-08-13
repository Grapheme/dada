var project = {
	openBrowser: false,
	port: 8080,
	vendor: {
		styles: ['bower_components/normalize-scss/_normalize.scss'],
		scripts: ['bower_components/jquery/dist/jquery.min.js'],
	},
	paths: {
		build: './build',
		app: './src'
	}
};

var gulp = require('gulp'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch'),
	open = require('gulp-open'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	gulpIgnore = require('gulp-ignore'),
	wiredep = require('wiredep').stream,
	concat = require('gulp-concat'),
	prefix = require('gulp-autoprefixer');

 
gulp.task('server', function() {
	connect.server({
		root: project.paths.build,
		livereload: true
	});
	if(project.openBrowser) {
		gulp.src(project.paths.build + '/index.html')
			.pipe(open('', { url: 'http://localhost:' + project.port }));
	}
});

gulp.task('scripts', function() {
  return gulp.src([
  		project.paths.app + '/scripts/config.js',
 			project.paths.app + '/scripts/parts/**/*.js',
  		project.paths.app + '/scripts/main.js'])
    .pipe(concat('main.concat.js'))
    .pipe(gulp.dest(project.paths.build + '/scripts/'))
    .pipe(connect.reload());
});

gulp.task('vendor', function () {
	gulp.src(project.vendor.styles)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(project.paths.build + '/styles/'));
	gulp.src(project.vendor.scripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(project.paths.build + '/scripts/'));
});

gulp.task('jade', function() {
	gulp.src(project.paths.app + '/views/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(project.paths.build))
		.pipe(connect.reload());
});

gulp.task('sass', function () {
	gulp.src(project.paths.app + '/styles/main.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
		.pipe(gulp.dest(project.paths.build + '/styles'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	watch(project.paths.app + '/views/**/*.jade', function() {
	    gulp.start('jade');
	});
	watch(project.paths.app + '/styles/**/*.scss', function() {
	    gulp.start('sass');
	});
	watch(project.paths.app + '/scripts/**/*.js', function() {
	    gulp.start('scripts');
	});
	watch('gulpfile.js', function() {
	    gulp.start('vendor');
	});
});

gulp.task('default', ['jade', 'scripts', 'vendor', 'sass', 'server', 'watch']);