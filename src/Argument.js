/**
 * An argument description
 */
export default class Argument {

	/**
	 * Construct an argument
	 *
	 * @param {string} argumentName The name of the argument
	 * @param {string} [description] The description of the argument
	 * @param {*} [defaultValue] The default value of the argument
	 */
	constructor(argumentName, description, defaultValue) {
		this._name = argumentName;
		this._description = description;
		this._defaultValue = defaultValue;
	}

	/**
	 * The argument name
	 * @returns {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * The argument description
	 * @returns {string}
	 */
	get description() {
		return this._description;
	}

	/**
	 * The default argument value
	 * @returns {*}
	 */
	get defaultValue() {
		return this._defaultValue;
	}

	/**
	 * Compare two arguments lexicographically by name
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
	 * @param {Argument} argA The first argument
	 * @param {Argument} argB The second argument
	 * @returns {number}
	 */
	static compare(argA, argB) {
		return argA._name.toLowerCase().localeCompare(argB._name.toLowerCase());
	}
}
