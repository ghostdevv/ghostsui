import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import gulpSass from 'gulp-sass';
import cssnano from 'cssnano';
import dartSass from 'sass';
import gulp from 'gulp';

const sass = gulpSass(dartSass);

const plugins = [
	cssnano(),
	autoprefixer({ overrideBrowserslist: ['defaults and last 4 version'] }),
	postcssImport(),
];

gulp.task('build', () =>
	gulp
		.src('./scss/ghostsui.scss')
		.pipe(sass())
		.pipe(postcss(plugins))
		.pipe(gulp.dest('./css')),
);

gulp.task('dev', () => gulp.watch('./scss/**/*.scss', gulp.series('build')));
