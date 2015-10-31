import sinon from 'sinon';

export default function stub() {
	const Task = sinon.stub();
	Task.prototype.constructor = Task;
	Task.prototype.addDependency = sinon.stub();
	Task.prototype.addArgument = sinon.stub();
	return Task;
}
