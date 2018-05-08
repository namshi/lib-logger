const assert = require('assert');
const logger = require('../index');

const TEST_STRING = 'hello world!';
const TEST_OBJ = { h: 1 };

describe('Logger', () => {
  describe('#get', () => {
    it('should return a message with string', () => {
      const { message, context } = logger.info(TEST_STRING);
      assert.equal(message, `'${TEST_STRING}'`);
      assert.deepEqual(context, {});
    });

    it('should return a object with value 1', () => {
      const { message, context } = logger.warn(TEST_OBJ);
      assert.equal(message, '');
      assert.equal(context.h, TEST_OBJ.h);
    });

    it('should return an error object', () => {
      const { message, context } = logger.warn(new Error(TEST_STRING));
      assert.notEqual(message.indexOf(TEST_STRING), -1);
      assert.ok(context.stack)
      assert.ok(context.status);
    });
  });
});
