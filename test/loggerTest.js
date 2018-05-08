const assert = require('assert');
const logger = require('../index');

const TEST_STRING = 'hello world!';
const TEST_OBJ = { h: 1 };

describe('Logger', () => {
  describe('#get', () => {
    it('should return a message with string', () => {
      const ret = logger.info(TEST_STRING);
      assert.equal(ret.message, `'${TEST_STRING}'`);
    });

    it('should return a object with value 1', () => {
      const ret = logger.warn(TEST_OBJ);
      assert.equal(ret.message, '');
      assert.equal(ret.h, TEST_OBJ.h);
    });

    it('should return an error object', () => {
      const ret = logger.warn(new Error(TEST_STRING));
      assert.equal(ret.message.indexOf(TEST_STRING) != -1, true);
      assert.ok(ret.stack);
      assert.ok(ret.status);
    });
  });
});
