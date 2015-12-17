'use strict';

import mockery from 'mockery';
import sinon from 'sinon';
import gulpUtilStub from '@mitmaro/js-test-stubs/stubs/gulp/util';
import wordwrapStub from '@mitmaro/js-test-stubs/stubs/wordwrap';
import taskStub from '../stubs/src/Task';
import argumentStub from '../stubs/src/Argument';

describe('Help', () => {
	let stubs;
	let Help;
	beforeEach(() => {
		stubs = {
			wordwrap: wordwrapStub(),
			gulpUtil: gulpUtilStub(),
			Task: taskStub(),
			Argument: argumentStub()
		};
		
		mockery.registerMock('wordwrap', stubs.wordwrap);
		mockery.registerMock('gulp-util', stubs.gulpUtil);
		mockery.registerMock('./Task', stubs.Task);
		mockery.registerMock('./Argument', stubs.Argument);

		mockery.registerAllowable('pad');
		mockery.registerAllowable('../../src/Help');

		Help = require('../../src/Help');
	});

	describe('(constructor)', () => {
		let helpTask;
		beforeEach(() => {
			helpTask = new Help('title', 'description');
		});

		it('should have correct title', () => {
			expect(helpTask._title).to.equal('title');
		});

		it('should have correct description', () => {
			expect(helpTask._description).to.equal('description');
		});
	});

	describe('.registerTask', () => {
		let helpTask;
		beforeEach(() => {
			helpTask = new Help('', '');
		});

		it('should register a task without dependecies or arguments', () => {
			helpTask.registerTask('taskName', 'taskDescription');
			expect(stubs.Task.prototype.constructor).to.be.calledWith();
			expect(helpTask._tasks).to.include.key('taskName');
		});

		it('should increase max name length if longer name', () => {
			helpTask._maxNameLength = 0;
			helpTask.registerTask('taskName', 'taskDescription');
			expect(helpTask._maxNameLength).to.equal(8);
		});

		it('should not increase max name length if not a longer name', () => {
			helpTask._maxNameLength = 20;
			helpTask.registerTask('taskName', 'taskDescription');
			expect(helpTask._maxNameLength).to.equal(20);
		});

		it('should error on unregistered dependency', () => {
			expect(() => {
				helpTask.registerTask('taskName', 'taskDescription', ['test12345'])
			}).to.throw(/dependency, test12345/);
		});

		it('should add registered dependency', () => {
			helpTask._tasks.foo = 'bar';
			helpTask.registerTask('taskName', 'taskDescription', ['foo']);
			expect(stubs.Task.prototype.addDependency).to.be.calledWith(helpTask._tasks.foo);
		});

		it('should error on unregistered argument', () => {
			expect(() => {
				helpTask.registerTask('taskName', 'taskDescription', [], ['test67890'])
			}).to.throw(/argument, test67890/);
		});

		it('should add registered argument', () => {
			helpTask._arguments.foo = 'bar';
			helpTask.registerTask('taskName', 'taskDescription', [], ['foo']);
			expect(stubs.Task.prototype.addArgument).to.be.calledWith(helpTask._arguments.foo);
		});
	});

	describe('.registerArgument', () => {
		let helpTask;
		beforeEach(() => {
			helpTask = new Help('', '');
		});

		it('should add argument', () => {
			helpTask.registerArgument('argName', 'description', 'default');
			expect(stubs.Argument.prototype.constructor).to.be.calledWith(
				'argName', 'description', 'default'
			);
		});

		it('should update max label length on longer name', () => {
			helpTask._maxLabelLength = 0;
			helpTask.registerArgument('argName', '', '');
			expect(helpTask._maxLabelLength).to.equal(7);
		});
	});

	describe('get*helpTask', () => {
		let helpTask;

		beforeEach(() => {
			helpTask = new Help('', '');
			helpTask._printHeader = sinon.stub();
			helpTask._printTaskList = sinon.stub();
			helpTask._printArgumentsList = sinon.stub();
			helpTask._printTaskDetails = sinon.stub();
		});

		it('should return a function', () => {
			expect(helpTask.helpTask).to.be.instanceOf(Function);
		});

		it('should return function that prints header', () => {
			helpTask.helpTask.call(helpTask);
			expect(helpTask._printHeader).to.be.called;
		});

		it('should return function that prints task list', () => {
			helpTask.helpTask.call(helpTask);
			expect(helpTask._printTaskList).to.be.called;
		});

		it('should return function that prints arguments list', () => {
			helpTask.helpTask.call(helpTask);
			expect(helpTask._printArgumentsList).to.be.called;
		});

		it('should return function that prints task details', () => {
			helpTask.helpTask.call(helpTask);
			expect(helpTask._printTaskDetails).to.be.called;
		});
	});

	describe('._printHeader', () => {
		it('should print title if it is provided', () => {
			const helpTask = new Help('Title');

			helpTask._printHeader();
			expect(stubs.gulpUtil._log.lines[1]).to.equal('Title');
		});

		it('should print description if it is provided', () => {
			const helpTask = new Help(null, 'Description');

			helpTask._printHeader();
			expect(stubs.gulpUtil._log.lines[3]).to.equal('Description');
		});

		it('should print usage', () => {
			const helpTask = new Help();

			helpTask._printHeader();
			expect(stubs.gulpUtil._log.lines[1]).to.equal('usage: gulp <task> <arguments>');
		});

		it('should not print title or description if they are not provided', () => {
			const helpTask = new Help(null, null);

			helpTask._printHeader();
			expect(stubs.gulpUtil._log.lines.length).to.equal(2);
		});
	});

	describe('._printTaskList', () => {
		let helpTask;

		beforeEach(() => {
			helpTask = new Help();
			helpTask._getMaxTaskNameLength = sinon.stub().returns(0);
		});

		it('should not print anything if there are no tasks', () => {
			helpTask._getTaskNamesList = sinon.stub().returns([]);
			helpTask._printTaskList();
			expect(stubs.gulpUtil._log.lines).to.be.empty;
		});

		it('should print single task', () => {
			helpTask._getMaxTaskNameLength = sinon.stub().returns(3);
			helpTask._getTaskNamesList = sinon.stub().returns(['foo']);
			helpTask._printTaskList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('foo  ');
		});

		it('should print task column with complete row', () => {
			helpTask._getMaxTaskNameLength = sinon.stub().returns(6);
			helpTask._getTaskNamesList = sinon.stub().returns([
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar',
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar'
			]);
			helpTask._printTaskList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal(
				'foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  '
			);
			expect(stubs.gulpUtil._log.lines.length).to.equal(3);
		});

		it('should print task column with incomplete row', () => {
			helpTask._getMaxTaskNameLength = sinon.stub().returns(6);
			helpTask._getTaskNamesList = sinon.stub().returns([
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar',
				'foobar', 'foobar'
			]);
			helpTask._printTaskList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal(
				'foobar  foobar  foobar  foobar  foobar  foobar  foobar  '
			);
			expect(stubs.gulpUtil._log.lines.length).to.equal(3);
		});

		it('should print task column with second incomplete row', () => {
			helpTask._getMaxTaskNameLength = sinon.stub().returns(6);
			helpTask._getTaskNamesList = sinon.stub().returns([
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar',
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar',
				'foobar', 'foobar', 'foobar', 'foobar', 'foobar'
			]);
			helpTask._printTaskList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal(
				'foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  foobar  '
			);
			expect(stubs.gulpUtil._log.lines[3]).to.equal(
				'foobar  foobar  foobar  foobar  foobar  '
			);
			expect(stubs.gulpUtil._log.lines.length).to.equal(4);
		});
	});

	describe('._printArgumentsList', () => {
		let helpTask;

		beforeEach(() => {
			helpTask = new Help();
			helpTask._getMaxArgumentNameLength = sinon.stub().returns(0);
		});

		it('should not print anything if there are no tasks', () => {
			helpTask._getArgumentsList = sinon.stub().returns([]);
			helpTask._printArgumentsList();
			expect(stubs.gulpUtil._log.lines).to.be.empty;
		});

		it('should print argument with no description or default value', () => {
			helpTask._getMaxArgumentNameLength = sinon.stub().returns(3);
			helpTask._getArgumentsList = sinon.stub().returns([{
				name: 'foo'
			}]);
			helpTask._printArgumentsList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('--foo  ');
			expect(stubs.gulpUtil._log.lines.length).to.equal(4);
		});

		it('should print argument with short description', () => {
			helpTask._getMaxArgumentNameLength = sinon.stub().returns(3);
			helpTask._getArgumentsList = sinon.stub().returns([{
				name: 'foo',
				description: 'description',
				defaultValue: 'default'
			}]);
			helpTask._printArgumentsList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('--foo  description');
		});

		it('should print argument with wrapping description (or newlines)', () => {
			helpTask._getMaxArgumentNameLength = sinon.stub().returns(3);
			helpTask._getArgumentsList = sinon.stub().returns([{
				name: 'foo',
				description: 'description \nthat has \nnewlines.',
				defaultValue: 'default'
			}]);
			helpTask._printArgumentsList();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('--foo  description ');
			expect(stubs.gulpUtil._log.lines[3]).to.equal('       that has ');
			expect(stubs.gulpUtil._log.lines[4]).to.equal('       newlines.');
		});

		it('should print default value if set', () => {
			helpTask._getMaxArgumentNameLength = sinon.stub().returns(3);
			helpTask._getArgumentsList = sinon.stub().returns([{
				name: 'foo',
				defaultValue: 'default'
			}]);
			helpTask._printArgumentsList();
			expect(stubs.gulpUtil._log.lines[3]).to.equal('       Default: default');
		});
	});

	describe('._printTaskDetails', () => {
		let helpTask;

		beforeEach(() => {
			helpTask = new Help();
			helpTask._getMaxTaskNameLength = sinon.stub().returns(0);
			Help._printTaskArguments = sinon.stub();
			Help._printTaskDependencies = sinon.stub();
		});

		it('should not print anything on no tasks', () => {
			helpTask._getTasksList = sinon.stub().returns([]);
			helpTask._printTaskDetails();
			expect(stubs.gulpUtil._log.lines).to.be.empty;
		});

		it('should print task with short description', () => {
			helpTask._getMaxTaskNameLength.returns(4);
			helpTask._getTasksList = sinon.stub().returns([
				{
					name: 'task',
					description: 'description'
				}
			]);
			helpTask._printTaskDetails();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('task  description');
		});

		it('should print task with long description', () => {
			helpTask._getMaxTaskNameLength.returns(4);
			helpTask._getTasksList = sinon.stub().returns([
				{
					name: 'task',
					description: 'abc\ndef\nghi'
				}
			]);
			helpTask._printTaskDetails();
			expect(stubs.gulpUtil._log.lines[2]).to.equal('task  abc');
			expect(stubs.gulpUtil._log.lines[3]).to.equal('      def');
			expect(stubs.gulpUtil._log.lines[4]).to.equal('      ghi');
		});

		it('should print task arguments and dependecies', () => {
			helpTask._getMaxTaskNameLength.returns(4);
			helpTask._getTasksList = sinon.stub().returns([
				{
					name: 'task',
					description: '',
					argumentsNames: ['arg'],
					dependenciesNames: ['dep']
				}
			]);
			helpTask._printTaskDetails();
			expect(Help._printTaskArguments).to.be.calledWith('      ', 74, ['arg']);
			expect(Help._printTaskDependencies).to.be.calledWith('      ', 74, ['dep']);
		});
	});

	describe('._getTasksList', () => {
		it('should return a sorted list of tasks', () => {
			const helpTask = new Help();

			helpTask._tasks = {'b': 'B', 'a': 'A', 'c': 'C'};
			expect(helpTask._getTasksList()).to.eql(['A', 'B', 'C']);
		});
	});

	describe('._getTaskNamesList', () => {
		it('should return a sorted list of task names', () => {
			const helpTask = new Help();

			helpTask._tasks = {'b': 'B', 'a': 'A', 'c': 'C'};
			expect(helpTask._getTaskNamesList()).to.eql(['a', 'b', 'c']);
		});
	});

	describe('._getMaxTaskNameLength', () => {
		it('should return length of longest name', () => {
			const helpTask = new Help();

			helpTask._tasks = {'bar': 'A', 'foobar': 'B', 'b': 'C'};
			expect(helpTask._getMaxTaskNameLength()).to.equal(6);
		});
	});

	describe('._getArgumentsList', () => {
		it('should return a sorted list of arguments', () => {
			const helpTask = new Help();

			helpTask._arguments = {'b': 'B', 'a': 'A', 'c': 'C'};
			expect(helpTask._getArgumentsList()).to.eql(['A', 'B', 'C']);
		});
	});

	describe('._getArgumentsNamesList', () => {	
		it('should return a sorted list of argument names', () => {
			const helpTask = new Help();

			helpTask._arguments = {'b': 'B', 'a': 'A', 'c': 'C'};
			expect(helpTask._getArgumentsNamesList()).to.eql(['a', 'b', 'c']);
		});
	});

	describe('._getMaxArgumentNameLength', () => {	
		it('should return a sorted list of argument names', () => {
			const helpTask = new Help();

			helpTask._arguments = {'bar': 'A', 'foobar': 'B', 'b': 'C'};
			expect(helpTask._getMaxArgumentNameLength()).to.equal(6);
		});
	});

	describe('#_printTaskDependencies', () => {

		it('should print nothing on empty dependecies', () => {
			Help._printTaskDependencies('', 0, []);
			expect(stubs.gulpUtil._log.lines).to.be.empty;
		});

		it('should print single dependency', () => {
			Help._printTaskDependencies('  ', 20, ['name']);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Sub Tasks: name');
		});

		it('should print exactly a single row of dependencies', () => {
			Help._printTaskDependencies('  ', 23, [
				'name', 'name'
			]);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Sub Tasks: name, name');
		});

		it('should print multiple rows of dependencies', () => {
			Help._printTaskDependencies('  ', 25, [
				'name', 'name', 'name'
			]);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Sub Tasks: name, name, ');
			expect(stubs.gulpUtil._log.lines[1]).to.equal('             name');
		});
	});

	describe('#_printTaskArguments', () => {

		it('should print nothing on empty arguments', () => {
			Help._printTaskArguments('', 0, []);
			expect(stubs.gulpUtil._log.lines).to.be.empty;
		});

		it('should print single dependency', () => {
			Help._printTaskArguments('  ', 20, ['name']);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Arguments: name');
		});

		it('should print exactly a single row of dependencies', () => {
			Help._printTaskArguments('  ', 23, [
				'name', 'name'
			]);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Arguments: name, name');
		});

		it('should print multiple rows of dependencies', () => {
			Help._printTaskArguments('  ', 25, [
				'name', 'name', 'name'
			]);
			expect(stubs.gulpUtil._log.lines[0]).to.equal('  Arguments: name, name, ');
			expect(stubs.gulpUtil._log.lines[1]).to.equal('             name');
		});
	});

});
