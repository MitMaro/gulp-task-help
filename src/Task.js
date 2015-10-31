import Argument from './Argument';

function extractName(task) {
	return task.name;
}

/**
 * A task description
 */
export default class Task {

	/**
	 * @param {string} taskName The task name
	 * @param {string=} description The task description
     */
	constructor(taskName, description) {
		this._name = taskName;
		this._description = description;
		this._dependencies = new Set();
		this._arguments = new Set();
	}

	/**
	 * @returns {string} The task name
     */
	get name() {
		return this._name;
	}

	/**
	 * @returns {string} The task description
     */
	get description() {
		return this._description;
	}

	/**
	 * @returns {Task[]} A sorted list of task dependencies
     */
	get dependencies() {
		return Array.from(this._dependencies).sort(Task.compare);
	}

	/**
	 * @returns {string[]} A sorted list of task dependency names
     */
	get dependenciesNames() {
		return Array.from(this._dependencies).map(extractName).sort();
	}

	/**
	 * @returns {Argument[]} A sorted list of task arguments
     */
	get arguments() {
		return Array.from(this._arguments).sort(Argument.compare);
	}

	/**
	 * @returns {string[]} A sorted list of task argument names
     */
	get argumentsNames() {
		return Array.from(this._arguments).map(extractName).sort();
	}

	/**
	 * Add an argument to the task
	 * @param {Argument} arg The argument to add
     */
	addArgument(arg) {
		this._arguments.add(arg);
	}

	/**
	 * Add a task dependency to the task
	 * @param {Task} dep The dependency to add
     */
	addDependency(dep) {
		dep.arguments.forEach((arg) => {
			this._arguments.add(arg);
		});
		this._dependencies.add(dep);
	}

	/**
	 * Compare two tasks lexicographically by name
	 * @param {Task} taskA The first task
	 * @param {Task} taskB The second task
	 * @returns {number} @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare|String.prototype.localeCompare}
     */
	static compare(taskA, taskB) {
		return taskA._name.toLowerCase().localeCompare(taskB._name.toLowerCase());
	}

}
