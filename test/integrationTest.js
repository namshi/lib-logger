/* global describe it */
require("chai").should();
const rewire = require("rewire");

const index = rewire("../index");
const logByLevel = index.__get__("logByLevel");
const { setLevel } = index.__get__("logger");

describe("Integration", () => {
  describe("#logByLevel", () => {
    it("should execute the info call of the logger", () => {
      index.__set__("log", { info: () => 3 });
      logByLevel("info")({ a: 1 }).should.equals(3);
    });
  });
  describe("#setLevel", () => {
    it("should execute the info call of the logger", () => {
      index.__set__("log", { transports: [{ level: 0 }, { level: 1 }] });
      setLevel(3);
      const log = index.__get__("log");
      log.should.have
        .property("transports")
        .with.length(2)
        .and.nested.deep.equals([{ level: 3 }, { level: 3 }]);
    });
  });
});
