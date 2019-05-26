/* global describe it */
require("chai").should();
const rewire = require("rewire");

const index = rewire("../index");
const dataStringify = index.__get__("dataStringify");
const sanatize = index.__get__("sanatize");

describe("Validators", () => {
  describe("#sanatize", () => {
    it("should remove any kind of new line symbol", () => {
      sanatize("Hola\nmundo!").should.equals("Hola mundo!");
      sanatize("Hola\n\nmundo!").should.equals("Hola  mundo!");
      sanatize("Hola\\nmundo!").should.equals("Hola mundo!");
    });
  });
  describe("#stringifyOr", () => {
    it("should return false if undefined is passed", () => {
      dataStringify("Hola\nmundo!").should.equals("Hola mundo!");
      dataStringify(33).should.equals("33");
    });
  });
});
