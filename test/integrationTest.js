/* global describe it */
require("chai").should();
const rewire = require("rewire");

const index = rewire("../index");
const logByLevel = index.__get__("logByLevel");

describe("Integration", () => {
  describe("#logByLevel", () => {
    it("should execute the info call of the logger", () => {
      index.__set__("log", { info: () => 3 });
      logByLevel("info")({ a: 1 }).should.equals(3);
    });
  });
});
