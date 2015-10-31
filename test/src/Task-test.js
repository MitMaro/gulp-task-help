'use strict';

import mockery from 'mockery';
import Task from '../../src/Task';

describe('Task', () => {
	let Task;

	beforeEach(() => {
		mockery.registerAllowable('./Argument');
		mockery.registerAllowable('../../src/Task');

		Task = require('../../src/Task');
	});

	describe('(constructor)', () => {
		let task;
		beforeEach(() => {
			task = new Task('name', 'description');
		});

		it('should set name', () => {
			expect(task._name).to.equal('name');
		});

		it('should set description', () => {
			expect(task._description).to.equal('description');
		});

		it('should have default for dependencies', () => {
			expect(task._dependencies).to.instanceOf(Set);
		});

		it('should have default for arguments', () => {
			expect(task._arguments).to.instanceOf(Set);
		});
	});

	describe('get*name', () => {
		it('should return the name', () => {
			const task = new Task('name');

			expect(task.name).to.equal('name');
		});
	});

	describe('get*description', () => {
		it('should return the description', () => {
			const task = new Task('', 'description');

			expect(task.description).to.equal('description');
		});
	});

	describe('get*dependencies', () => {
		it('should return sorted dependencies', () => {
			const task = new Task('', '');
			task._dependencies = new Set([
				{_name: 'b'}, {_name: 'c'}, {_name: 'a'}
			]);

			expect(task.dependencies).to.eql([
				{_name: 'a'}, {_name: 'b'}, {_name: 'c'}
			]);
		});
	});

	describe('get*dependenciesNames', () => {
		it('should return sorted dependencies names', () => {
			const task = new Task('', '');
			task._dependencies = new Set([
				{name: 'b'}, {name: 'c'}, {name: 'a'}
			]);

			expect(task.dependenciesNames).to.eql(['a', 'b', 'c']);
		});
	});

	describe('get*arguments', () => {
		it('should return sorted arguments', () => {
			const task = new Task('', '');
			task._arguments = new Set([
				{_name: 'b'}, {_name: 'c'}, {_name: 'a'}
			]);

			expect(task.arguments).to.eql([
				{_name: 'a'}, {_name: 'b'}, {_name: 'c'}
			]);
		});
	});

	describe('get*argumentsNames', () => {
		it('should return sorted arguments names', () => {
			const task = new Task('', '');
			task._arguments = new Set([
				{name: 'b'}, {name: 'c'}, {name: 'a'}
			]);

			expect(task.argumentsNames).to.eql(['a', 'b', 'c']);
		});
	});

	describe('.addArgument', () => {
		it('should add an argument', () => {
			const task = new Task('', '');

			task.addArgument('foo');

			expect(task.arguments).to.eql(['foo']);
		});
	});

	describe('.addDependency', () => {
		it('should add a dependency without arguments', () => {
			const task = new Task('', '');

			task.addDependency({name: 'dep', arguments: []});

			expect(task.dependencies).to.eql([{name: 'dep', arguments: []}]);
		});

		it('should add a dependency with arguments', () => {
			const task = new Task('', '');

			task.addDependency({name: 'dep', arguments: ['bar']});

			expect(task.dependencies).to.eql([{name: 'dep', arguments: ['bar']}]);
			expect(task.arguments).to.eql(['bar']);
		});
	});

	describe('#compare', () => {
		it('should compare equal arguments', () => {
			expect(Task.compare(
				{_name: 'aaa'}, {_name: 'aaa'}
			)).to.equal(0);
		});

		it('should compare lesser strings', () => {
			expect(Task.compare(
				{_name: 'aaa'}, {_name: 'bbb'}
			)).to.be.below(0);
		});

		it('should compare greater strings', () => {
			expect(Task.compare(
				{_name: 'bbb'}, {_name: 'aaa'}
			)).to.be.above(0);
		});

		it('should ignore case in comparision', () => {
			expect(Task.compare(
				{_name: 'AAA'}, {_name: 'aaa'}
			)).to.be.equal(0);
		});
	});
});
