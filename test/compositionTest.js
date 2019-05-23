/* global describe it */
require("chai").should();
const rewire = require("rewire");

const index = rewire("../index");
const addMessage = index.__get__("addMessage");
const dataStringify = index.__get__("dataStringify");
const withError = index.__get__("withError");
const withObject = index.__get__("withObject");
const withMessage = index.__get__("withMessage");
const addArg = index.__get__("addArg");
const parseArgs = index.__get__("parseArgs");

describe("Builders", () => {
  describe("#dataStringify", () => {
    it("should return empty string if empty string passed", () => {
      dataStringify("")
        .should.be.a("string")
        .that.equals("");
    });
    it("should stringify a number", () => {
      dataStringify(1)
        .should.be.a("string")
        .that.equals("1");
    });
    it("should stringify an object", () => {
      dataStringify({ a: 3 })
        .should.be.a("string")
        .that.equals('{"a":3}');
    });
    it("should stringify an error with his stack in single line", () => {
      dataStringify(new Error("hole"))
        .should.be.a("string")
        .that.include("Error: hole")
        .and.not.include("\n");
    });
  });
  describe("#addMessage", () => {
    it("should return empty array if nothing passed", () => {
      addMessage().should.deep.equals([]);
      addMessage(null).should.deep.equals([]);
      addMessage("").should.deep.equals([]);
    });
    it("should return concat an array if messages passed", () => {
      addMessage("hello", { messages: ["world"] }).should.deep.equals(["world", "hello"]);
    });
  });
  describe("#withError", () => {
    it("should return empty structure if nothing passed", () => {
      withError().should.deep.equals({ context: {}, messages: [] });
      withError(null).should.deep.equals({ context: {}, messages: [] });
    });
    it("should append status code and stack if there is any", () => {
      withError({ statusCode: 400 }).should.deep.equals({ context: { status: 400 }, messages: [] });
    });
    it("should append status code and stack if there is any", () => {
      withError({ stack: "lalala" }).should.deep.equals({ context: { status: 500, stack: "lalala" }, messages: [] });
    });
    it("should append status code, stack and context if there is any", () => {
      withError({ stack: "lalala" }, { context: { a: 3 } }).should.deep.equals({ context: { a: 3, status: 500, stack: "lalala" }, messages: [] });
    });
  });
  describe("#withObject", () => {
    it("should return empty structure if nothing passed", () => {
      withObject().should.deep.equals({ context: {}, messages: [] });
      withObject(null).should.deep.equals({ context: {}, messages: [] });
    });
    it("should return appended object if it's passed", () => {
      withObject({ a: 1 }).should.deep.equals({ context: { a: 1 }, messages: [] });
    });
    it("should return appended object and context if it's passed", () => {
      withObject({ a: 1 }, { context: { b: 3 } }).should.deep.equals({ context: { b: 3, a: 1 }, messages: [] });
    });
  });
  describe("#withMessage", () => {
    it("should return empty structure if nothing passed", () => {
      withMessage().should.deep.equals({ context: {}, messages: [] });
      withMessage(null).should.deep.equals({ context: {}, messages: [] });
    });
    it("should append an object stringified in passed", () => {
      withMessage({}).should.deep.equals({ context: {}, messages: ["{}"] });
    });
    it("should append an object stringified in passed", () => {
      const msg = withMessage(new Error("shit"));
      msg.should.have.property("context");
      msg.should.have.property("messages");
      msg.messages.should.have.length(1);
      msg.messages[0].should.include("Error: shit");
    });
  });
  describe("#addArg", () => {
    it("should return empty structure if nothing is passed", () => {
      addArg().should.deep.equals({ context: {}, messages: [] });
      addArg(null).should.deep.equals({ context: {}, messages: [] });
    });
    it("should adds any basic type to messages as string", () => {
      addArg("string").should.deep.equals({ context: {}, messages: ["string"] });
      addArg(432342).should.deep.equals({ context: {}, messages: ["432342"] });
      addArg(true).should.deep.equals({ context: {}, messages: ["true"] });
    });
    it("should adds any object to the structure", () => {
      addArg({ a: 1 }).should.deep.equals({ context: { a: 1 }, messages: [] });
      addArg({}).should.deep.equals({ context: {}, messages: [] });
    });
    it("should adds any error", () => {
      const msg = addArg(new Error("shit"));
      msg.should.have.property("context");
      msg.should.have.property("messages");
      msg.messages.should.have.length(1);
      msg.messages[0].should.include("Error: shit");
    });
  });
  describe("#parseArgs", () => {
    it("should adds regular type to messages", () => {
      parseArgs(["hola"]).should.deep.equals({ messages: "hola", context: {} });
    });
    it("should concat regular types to messages", () => {
      parseArgs(["hola", 11]).should.deep.equals({ messages: "hola,11", context: {} });
    });
    it("should adds object to context", () => {
      parseArgs([{ a: 1 }]).should.deep.equals({ messages: "", context: { a: 1 } });
    });
    it("should adds object by order of precedence to context", () => {
      parseArgs([{ a: 1 }, { b: 2 }, { a: 3 }]).should.deep.equals({ messages: "", context: { a: 3, b: 2 } });
    });
    it("should adds object by order of precedence to context", () => {
      const msg = parseArgs([new Error("shit")]);
      msg.should.have.nested.include({ "context.status": 500 });
      msg.should.have.nested.include({ messages: "Error: shit" });
    });
  });
});
