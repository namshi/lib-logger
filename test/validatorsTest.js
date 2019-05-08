/* global describe it */
require("chai").should();
const rewire = require("rewire");

const index = rewire("../index");
const isObject = index.__get__("isObject");
const isError = index.__get__("isError");

describe("Validators", () => {
  describe("#isError", () => {
    it("should return false if undefined is passed", () => {
      isError().should.equals(false);
    });
    it("should return false if null is passed", () => {
      isError(null).should.equals(false);
    });
    it("should return false if string is passed", () => {
      isError("").should.equals(false);
      isError("xxxlkjadsf").should.equals(false);
      isError("1324.32").should.equals(false);
    });
    it("should return false if number is passed", () => {
      isError(234).should.equals(false);
      isError(123.44).should.equals(false);
    });
    it("should return false if an object or array is passed", () => {
      isError([]).should.equals(false);
      isError({}).should.equals(false);
    });
    it("should return true if an object with error structure is passed", () => {
      isError({ stack: "" }).should.equals(false);
      isError({ stack: "", message: "" }).should.equals(false);
      isError({ stack: "x", message: "" }).should.equals(false);
      isError({ stack: "x", message: "x" }).should.equals(true);
    });
    it("should return true if error is passed", () => {
      isError(new Error("error")).should.equals(true);
      isError(Error("error")).should.equals(true);
    });
  });
  describe("#isObject", () => {
    it("should return false if empty string passed", () => {
      isObject("").should.equals(false);
    });
    it("should return false if undefined passed", () => {
      isObject().should.equals(false);
    });
    it("should return false if null passed", () => {
      isObject(null).should.equals(false);
    });
    it("should return false if an array is passed", () => {
      isObject([1]).should.equals(false);
    });
    it("should return false if a number is passed", () => {
      isObject(13).should.equals(false);
    });
    it("should return true if an object is passed", () => {
      isObject({}).should.equals(true);
      isObject({ a: 1 }).should.equals(true);
      isObject(new Error("hehe")).should.equals(true);
    });
  });
});
