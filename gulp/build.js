'use strict';

export default function createBuildTask(gulp, plugins, options, data) {
	return function cleanBuild() {
		plugins.util.log(plugins.util.colors.blue('build: starting'));
		gulp.src(data.sources)
			.pipe(plugins.babel())
			.pipe(gulp.dest(options.destination))
		;
		plugins.util.log(plugins.util.colors.green('build: complete'));
	};
};
