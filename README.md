# Gulp Task Help

Provides a gulp task that will display a help message describing the tasks as well as their dependencies and arguments.

## Preview

![gulp-task-help](https://cloud.githubusercontent.com/assets/177427/10861145/089127ba-7f5a-11e5-9e0d-8e60f21a40f7.png)

## Install

    npm i --save-dev gulp-task-help

## Usage
	
	var Help = require('Help');
	
	// create the help task instance
	const help = new Help(
		'Project Title',
		'Project Description
	);
	
	// register each argument
	help.registerArgument(
		'arg-name', 'Argument description', 'default value'
	);

	help.registerTask(
		'task:name',
		'Task description',
		['task:dependency'],
		['argument-name']
	);

	// register the task
	gulp.task('help', help.helpTask);

## API Documentation

[Full API Documentation](https://doc.esdoc.org/github.com/MitMaro/gulp-task-help/)

#### `new Help(title, description)`

Argument Name | Type | Description
---|---|---
title | `string` | Generally the title of the application
description | `string` | A description of the application or the build system

#### `registerTask(taskName, description, dependencies, args)`

Argument Name | Type | Description | Default
---|---|---|---
taskName | `string` | The name of the task as registered with gulp
description | `string` | The description of the tasks
dependencies | `string[]` | A list of dependant task nams | `[]`
args | `string[]` | A list of argument names | `[]`

#### `registerArgument(argumentName, description, defaultValue)`
Argument Name | Type | Description
---|---|---
argumentName | `string` | The name of the argument
description | `string` | The description of the argument
defaultValue | `string` | A default value, or description of the default value
 
## License

Gulp Task Help is released under the ISC license. See [LICENSE](LICENSE).
