'use strict';

import Argument from '../../src/Argument';

describe('Argument', () => {
	describe('(constructor)', () => {
		let argument;
		
		beforeEach(() => {
			argument = new Argument('name', 'description', 'default');
		});

		it('should set name', () => {
			expect(argument._name).to.equal('name');
		});

		it('should set description', () => {
			expect(argument._description).to.equal('description');
		});

		it('should set default value', () => {
			expect(argument._defaultValue).to.equal('default');
		});
	});

	describe('get*name', () => {
		it('should return name', () => {
			let argument = new Argument('name');
			expect(argument.name).to.equal('name');
		});
	});

	describe('get*description', () => {
		it('should return description', () => {
			let argument = new Argument('', 'description');
			expect(argument.description).to.equal('description');
		});
	});

	describe('get*defaultValue', () => {
		it('should return default value', () => {
			let argument = new Argument('', '', 'default value');
			expect(argument.defaultValue).to.equal('default value');
		});
	});

	describe('#compare', () => {
		it('should compare equal arguments', () => {
			expect(Argument.compare(
				{_name: 'aaa'}, {_name: 'aaa'}
			)).to.equal(0);
		});

		it('should compare lesser strings', () => {
			expect(Argument.compare(
				{_name: 'aaa'}, {_name: 'bbb'}
			)).to.be.below(0);
		});

		it('should compare greater strings', () => {
			expect(Argument.compare(
				{_name: 'bbb'}, {_name: 'aaa'}
			)).to.be.above(0);
		});

		it('should ignore case in comparision', () => {
			expect(Argument.compare(
				{_name: 'AAA'}, {_name: 'aaa'}
			)).to.be.equal(0);
		});
	});
});

