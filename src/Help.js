import pad from 'pad';
import wordwrap from 'wordwrap';
import {log, colors} from 'gulp-util';
import Task from './Task';
import Argument from  './Argument';

const MIN_NAME_LENGTH = 15;
const MAX_LINE_LENGTH = 80;
const COL_PADDING = 2;
const lineWrap = wordwrap(MAX_LINE_LENGTH);

function logLines(line, color) {
	let lines = lineWrap(line).split('\n');
	lines.forEach((l) => {
		log(color(l));
	});
}

function wrapTask(task) {
	return colors.yellow(task);
}

function wrapArgument(arg) {
	return colors.magenta.bold(arg);
}

/**
 * Describes a series of tasks, their dependencies and arguments
 */
export default class Help {

	/**
	 * @param {string} [title] The title of the project
	 * @param {string} [description] A description for the project
     */
	constructor(title, description) {
		this._title = title;
		this._description = description;
		this._tasks = {};
		this._arguments = {};
		this._maxLabelLength = MIN_NAME_LENGTH;
	}

	/**
	 * Register a task
	 * @param {string} taskName The name
	 * @param {string} description The description
	 * @param {Task[]} [dependencies=[]] The dependant tasks
     * @param {Argument[]} [args=[]] The arguments
     */
	registerTask(taskName, description, dependencies = [], args = []) {
		const task = new Task(taskName, description);

		dependencies.forEach((dep) => {
			// validate dependency
			if (!this._tasks[dep]) {
				throw new Error('The dependency, ' + dep + ', is not registered');
			}
			task.addDependency(this._tasks[dep]);
		});

		args.forEach((arg) => {
			// validate arguments
			if (!this._arguments[arg]) {
				throw new Error('The argument, ' + arg + ', is not registered');
			}
			task.addArgument(this._arguments[arg]);
		});

		this._tasks[taskName] = task;

		if (taskName.length > this._maxNameLength) {
			this._maxNameLength = taskName.length;
		}
	}

	/**
	 * Register an argument
	 *
	 * @param {string} argumentName The name
	 * @param {string} description The description
	 * @param {string} [defaultValue] The default value
     */
	registerArgument(argumentName, description, defaultValue) {
		this._arguments[argumentName] = new Argument(argumentName, description, defaultValue);

		if (argumentName.length > this._maxLabelLength) {
			this._maxLabelLength = argumentName.length;
		}
	}

	/**
	 * Get a gulp task function. This should be passed to gulp.task.
	 * @returns {function(): undefined} The gulp task function
     */
	get helpTask() {
		return () => {
			this._printHeader();
			this._printTaskList();
			this._printArgumentsList();
			this._printTaskDetails();
		};
	}

	_printHeader() {
		log();
		if (this._title) {
			log(colors.cyan.bold(this._title));
		}
		log(colors.gray('usage: ') + colors.blue('gulp ') + '<' + wrapTask('task') + '> <' + wrapArgument('arguments') + '>');
		if (this._description) {
			log();
			logLines(this._description, colors.white);
		}
	}

	_printTaskList() {
		const taskColWidth = this._getMaxTaskNameLength() + COL_PADDING;
		const taskNames = this._getTaskNamesList();
		const numberOfTaskColumns = Math.floor(MAX_LINE_LENGTH / (taskColWidth));
		let line;

		if (!taskNames.length) {
			return;
		}

		log();
		log(colors.green.underline('Tasks List'));
		line = '';
		for (let i = 1; i <= taskNames.length; i++) {
			line += wrapTask(pad(taskNames[i - 1], taskColWidth));
			if ((i % numberOfTaskColumns) === 0) {
				log(line);
				line = '';
			}
		}
		// log last line if it exists
		if (line !== '') {
			log(line);
		}
	}

	_printArgumentsList() {
		const argsColWidth = this._getMaxArgumentNameLength() + COL_PADDING + 2; // +2 for --
		const args = this._getArgumentsList();
		const max_line_length = MAX_LINE_LENGTH - argsColWidth;
		const indent = ' '.repeat(argsColWidth);
		let wrap = wordwrap(max_line_length);

		if (!args.length) {
			return;
		}

		log();
		log(colors.green.underline('Arguments List'));
		args.forEach((arg) => {
			let argumentName = pad('--' + arg.name, argsColWidth);

			if (arg.description) {
				let lines = wrap(arg.description).split("\n");
				log(wrapArgument(argumentName) + colors.white(lines[0]));
				
				// rest of the lines, besides last
				for (let i = 1; i < lines.length ; i++) {
					log(indent + colors.white(lines[i]));
				}
			}
			else {
				log(wrapArgument(argumentName));
			}

			// print defaults
			if (arg.defaultValue) {
				log(indent + colors.cyan('Default: ') + colors.yellow(arg.defaultValue));
			}
			log();
		});
	}

	_printTaskDetails() {
		const tasks = this._getTasksList();
		const taskColWidth = this._getMaxTaskNameLength() + COL_PADDING;
		const maxLineLength = MAX_LINE_LENGTH - taskColWidth;
		const indent = ' '.repeat(taskColWidth);
		let wrap = wordwrap(maxLineLength);

		if (!tasks.length) {
			return;
		}

		log();
		log(colors.green.underline('Tasks Details'));
		tasks.forEach((task) => {
			let taskName = pad(task.name, taskColWidth);
			let lines = wrap(task.description).split("\n");

			log(wrapTask(taskName) + colors.white(lines[0]));

			// rest of the lines
			for (let i = 1; i < lines.length ; i++) {
				log(indent + colors.white(lines[i]));
			}

			Help._printTaskArguments(indent, maxLineLength, task.argumentsNames);
			Help._printTaskDependencies(indent, maxLineLength, task.dependenciesNames);

			log();
		});

	}

	_getTasksList() {
		// turn tasks object into a task name sorted array
		return Object.keys(this._tasks).sort().map((task) => {
			return this._tasks[task];
		});
	}

	_getTaskNamesList() {
		// turn tasks object into a task name sorted array
		return Object.keys(this._tasks).sort();
	}

	_getMaxTaskNameLength() {
		return Object.keys(this._tasks).reduce((prevValue, currentValue) => {
			return (prevValue > currentValue.length ? prevValue : currentValue.length);
		}, 0);
	}

	_getArgumentsList() {
		// turn arguments object into a argument name sorted array
		return Object.keys(this._arguments).sort().map((arg) => {
			return this._arguments[arg];
		});
	}

	_getArgumentsNamesList() {
		// turn tasks object into a task name sorted array
		return Object.keys(this._arguments).sort();
	}

	_getMaxArgumentNameLength() {
		return Object.keys(this._arguments).reduce((prevValue, currentValue) => {
			return (prevValue > currentValue.length ? prevValue : currentValue.length);
		}, 0);
	}

	static _printTaskDependencies(indent, maxLineLength, dependencies) {
		let out;
		let length;
		const baseLength = 11 + indent.length;

		// do nothing on empty dependencies
		if (!dependencies.length) {
			return;
		}

		out = colors.green.dim('Sub Tasks: ');
		length = baseLength; // Sub Tasks length before wrap
		for (let i = 0; i < dependencies.length; i++) {
			let dep = dependencies[i];
			let nameLength = dep.length; // +2 for space and comma

			// add trailing comma to all but last
			if (i < dependencies.length - 1) {
				nameLength += 2;
			}

			if (length + nameLength > maxLineLength) {
				log(indent + out);
				out = '           ';
				length = baseLength;
			}
			out += wrapTask(dep);

			// add trailing comma to all but last
			if (i < dependencies.length - 1) {
				out += ', ';
			}

			length += nameLength;
		}
		log(indent + out);
	}

	static _printTaskArguments(indent, maxLineLength, args) {
		let out;
		let length;
		const baseLength = 11 + indent.length;

		// do nothing on empty dependencies
		if (!args.length) {
			return;
		}

		out = colors.green.dim('Arguments: ');
		length = baseLength; // Sub Tasks length before wrap
		for (let i = 0; i < args.length; i++) {
			let arg = args[i];
			let nameLength = arg.length; // +2 for space and comma

			// add trailing comma length to all but last
			if (i < args.length - 1) {
				length += 2;
			}

			if (length + nameLength > maxLineLength) {
				log(indent + out);
				out = '           ';
				length = baseLength;
			}
			out += wrapArgument(arg);

			// add trailing comma to all but last
			if (i < args.length - 1) {
				out += ', ';
			}

			length += nameLength;
		}
		log(indent + out);
	}

}
