'use strict';
import del from 'del';

export default function createCleanTask(gulp, plugins, options, data) {
	return function cleanTask() {
		// skip clean unless clean flag provided, but always clean for clean command
		if (options.command !== 'clean' && options.noClean) {
			plugins.util.log('clean: disabled');
			return null;
		}

		plugins.util.log(plugins.util.colors.blue('clean: starting'));
		return del(data.cleanPatterns).then(function delThen(paths) {
			if (paths.length) {
				plugins.util.log(plugins.util.colors.yellow('clean: files/folders'));
				paths.forEach(function pathsForEach(path) {
					plugins.util.log(plugins.util.colors.red('clean: del ' + path));
				});
			}
			plugins.util.log(plugins.util.colors.green('clean: complete'));
		});
	};
};
