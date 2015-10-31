'use strict';
import {spawn} from 'child_process';

export default function createTestTask(gulp, plugins, options) {
	return function testTask(done) {
		let command;
		let args;
		let mocha;
		plugins.util.log(plugins.util.colors.blue('test: starting'));

		if (options.coverage) {
			command = 'node_modules/.bin/babel-node';
			args = [
				'node_modules/.bin/babel-istanbul', 'cover', 'node_modules/.bin/_mocha', '--'
			];
		}
		else {
			command = 'node_modules/.bin/mocha';
			args = [
				'--compilers', 'js:babel/register'
			];
		}

		// optional set bail flag to mocha
		if (options.bail) {
			args.push('--bail');
		}

		mocha = spawn(command, args, {stdio: 'inherit'});
		mocha.on('exit', (code) => {
			plugins.util.log(plugins.util.colors.green('test: complete'));
			if (code) {
				return done(plugins.util.colors.red('test: mocha exited with code: ' + code));
			}
			return done();
		});
	};
};
