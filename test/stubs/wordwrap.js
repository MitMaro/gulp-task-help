import sinon from 'sinon';

export default function stub() {
	const wordwrap = sinon.stub();

	wordwrap._instance = sinon.stub().returnsArg(0);
	wordwrap.returns(wordwrap._instance);
	
	return wordwrap;
};
