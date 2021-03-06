'use strict';
import gulp from 'gulp';
import {argv} from 'yargs';
import clean from '@mitmaro/gulp-clean';
import buildBabel from '@mitmaro/gulp-build-babel';
import babelMocha from '@mitmaro/gulp-babel-mocha';
import Help from './';

const options = {
	destination: argv.destination || './lib',
	clean: argv.clean || true,
	coverage: argv.coverage || false,
	bail: argv.bail || false
};

const data = {
	cleanPatterns: [options.destination],
	sources: ['./src/**/**.js']
};

const help = new Help(
	'Gulp Task: Help'
);

help.registerArgument(
	'clean', 'Run clean before running tasks.', 'true'
);

help.registerArgument(
	'bail', 'Stop tests after first failure', 'false'
);

help.registerArgument(
	'coverage', 'Generate a coverage report from the run tests.', 'false'
);

help.registerArgument(
	'destination', 'The build files destination directory.', 'lib'
);

help.registerTask(
	'clean',
	'Removed all files and folders generated by the build'
);

help.registerTask(
	'help',
	'Shows information on the usage of gulp.'
);
help.registerTask(
	'test',
	'Run the test suite',
	[],
	['coverage', 'bail']
);
help.registerTask(
	'build',
	'Builds the project',
	['clean'],
	['destination', 'clean']
);

gulp.task('clean', clean(data.cleanPatterns, options));
gulp.task('test', babelMocha(options));
gulp.task('build', ['clean'], buildBabel(data.sources, options.destination));
gulp.task('help', help.helpTask);
gulp.task('default', ['help']);
