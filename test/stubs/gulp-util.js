import sinon from 'sinon';

function createColor() {
	var stub = sinon.stub().returnsArg(0);
	stub.bold = sinon.stub().returnsArg(0);
	stub.dim = sinon.stub().returnsArg(0);
	stub.underline = sinon.stub().returnsArg(0);
	return stub;
}

class Log {
	constructor() {
		this._output = [];
	}

	get lines() {
		return this._output;
	}

	get output() {
		return this._output.join('\n');
	}

	log(line) {
		this._output.push(line || '');
	}
}

export default function stub() {
	const util = {};

	const log = new Log();

	util.log = log.log.bind(log);
	util._log = log;
	util.colors = {
		cyan: createColor(),
		gray: createColor(),
		blue: createColor(),
		yellow: createColor(),
		magenta: createColor(),
		white: createColor(),
		green: createColor()
	};

	return util;
}
