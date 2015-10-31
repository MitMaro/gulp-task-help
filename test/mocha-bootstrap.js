'use strict';
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.config.includeStack = true;
global.chai = chai;
global.expect = chai.expect;
global.chai.use(sinonChai);
