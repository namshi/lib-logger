const mocha = require('mocha');
const path = require('path');
const should = require('should');
const assert = require('assert');
const proxyquire = require('proxyquire');


const createLogger = e => ({
        levels: {'info':1,'warn':2}, 
        transports : [{level:"info"}],
        info: (n,o) => ({type:'info',"o":o}),
        warn: (n,o) => ({type:'warn',"o":o})

});

const format = {
    json: e => true,
    combine: e=> true,
    timestamp: e => true
};
function Console(){}
const transports = {Console};
const winston = { 
    createLogger,
    format,
    transports
};

const logger = proxyquire('../index.js', {
  'winston': winston 
});

const TEST_STRING = 'hello world!';
const TEST_OBJ = {h:1}; 

describe('DeliveryPromise', () => {
  describe('#get', () => {
    it('should return a message with string',() => {
        let ret = logger.info(TEST_STRING)
        assert.equal(ret.type,"info")
        assert.equal(ret.o.message,"'"+TEST_STRING+"'")
    });
    it('should return a object with value 1',() => {
        let ret = logger.warn(TEST_OBJ)
        assert.equal(ret.type,"warn")
        assert.equal(ret.o.h,TEST_OBJ.h)
    });
    it('should return an error object',() => {
        let ret = logger.warn(new Error(TEST_STRING))
        assert.equal(ret.type,"warn")
        assert.equal(ret.o.message.indexOf(TEST_STRING) != -1,true)
    });
  });
});