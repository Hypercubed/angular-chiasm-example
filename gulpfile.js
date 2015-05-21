var gulp = require('gulp');
var browserSync = require('browser-sync');
var jspm = require('jspm');
var del = require('del');
var cache = require('gulp-cached');
var ghPages = require('gulp-gh-pages');

var path = {
	source:'app/**/*.js',
	html: '**/*.html',
	templates: 'app/components/**/*.html',
	output:'dist/'
};

gulp.task('copy', function () {
	return gulp.src([
		  './app/*.{js,json,html,ico,txt}',
			'./app/{jspm_packages,lib}/*.{js,map}',
			'./app/{components,images}/**/*.{json,html,csv,png}'
		])
		.pipe(cache('copy'))
		.pipe(gulp.dest(path.output))
		.pipe(browserSync.reload({ stream: true }));
});


gulp.task('jspm', function() {
	var builder = new jspm.Builder();

	return builder.loadConfig('./app/system.config.js') // jspm's config js
	.then(function() {
		builder.config({ // additional config
			baseURL: 'app',
			lib: 'app'
		});

		// building a self executing build
		return builder.build('components/app + dummyVis + chiasm/plugins/*', 'dist/components/bundle.js', 'dist/components/bundle.js',
			{
				sourceMaps: true,
				minify: true,
				mangle: false
			});
	});
});

gulp.task('serve', [], function (done) {
	browserSync({
		open: true,
		port: 9000,
		server: {
			baseDir: ['app'],
			middleware: function (req, res, next) {
				res.setHeader('Access-Control-Allow-Origin', '*');
				next();
			}
		}
	}, done);
});

gulp.task('serve:dist', ['build'], function (done) {
	browserSync({
		open: true,
		port: 9000,
		server: {
			baseDir: ['dist'],
			middleware: function (req, res, next) {
				res.setHeader('Access-Control-Allow-Origin', '*');
				next();
			}
		}
	}, done);
});

gulp.task('watch', ['serve'], function() {
	gulp.watch(['app/**/*.{js,css,html,json}'], function(file){
		browserSync.reload(file.path);
	}).on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('clean', function (cb) {
	del(['dist',], cb);
});

gulp.task('deploy', ['build'], function() {
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
});

gulp.task('build', ['copy', 'jspm']);
