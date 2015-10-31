import sinon from 'sinon';

export default function stub() {
	const Argument = sinon.stub();
	Argument.prototype.constructor = Argument;
	return Argument;
}
