import mockery from 'mockery';

before('suite setup:before', () => {
	mockery.enable({ useCleanCache: true });
});

afterEach('suite setup:afterEach', () => {
	mockery.deregisterAll();
	mockery.resetCache();
});

after('suite setup:after', () => {
	mockery.disable();
});
