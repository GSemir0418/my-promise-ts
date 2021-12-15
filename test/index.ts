import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import MyPromise from "../src/promise";

chai.use(sinonChai);

const { assert } = chai;

describe("Promise", () => {
  it("是一个类", () => {
    // @ts-ignore
    assert.isFunction(MyPromise);
    assert.isObject(MyPromise.prototype);
  });
  it("new Promise()接受一个函数", () => {
    assert.throw(() => {
      //@ts-ignore
      new MyPromise();
    });
    assert.throw(() => {
      //@ts-ignore
      new MyPromise(1);
    });
  });
  it("new Promise(fn)会实例化一个对象，对象有then方法", () => {
    assert.isFunction(new MyPromise(() => {}).then);
  });
  it("new Promise(fn)中的fn立即执行", () => {
    const fn = sinon.fake();
    new MyPromise(fn);
    assert(fn.called);
  });
  it("p.then(success)的success回调会在resolve被调用后执行", (done) => {
    const success = sinon.fake();
    const p = new MyPromise((resolve) => {
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        assert(success.called);
        done();
      });
    });
    // @ts-ignore
    p.then(success);
  });
  it("then接收的参数如果不是函数，则直接忽略", () => {
    const p = new MyPromise((resolve, reject) => {
      resolve();
      reject();
    });
    p.then(false, 1);
  });
  it("success函数必须在promise完成(fulfilled)后被调用,并把promise的值作为它的第一个参数；完成(fulfilled)之前绝对不能被调用；绝对不能被调用超过一次", (done) => {
    const success = sinon.fake();
    const p = new MyPromise((resolve) => {
      assert.isFalse(success.called);
      resolve(233);
      resolve(111);
      setTimeout(() => {
        assert(p.state === "fulfilled");
        assert(success.calledOnce);
        assert(success.calledWith(233));
        done();
      }, 0);
    });
    p.then(success);
  });
  it("在我们的代码执行结束之前，不得调用then中的两个函数", (done) => {
    const success = sinon.fake();
    const p = new MyPromise((resolve) => {
      resolve();
    });
    p.then(success);
    assert.isFalse(success.called);
    setTimeout(() => {
      assert(success.called);
      done();
    }, 0);
  });
  it("then的两个函数只能以函数形式调用，即内部this指向undefined", (done) => {
    const p = new MyPromise((resolve) => {
      resolve();
    });
    p.then(function () {
      "use strict";
      assert(this === undefined);
      done();
    });
  });
  it("then可以在同一个promise中多次调用，且依据then的顺序调用", (done) => {
    const p = new MyPromise((resolve) => {
      resolve();
    });
    const callback = [sinon.fake(), sinon.fake(), sinon.fake()];
    p.then(callback[0]);
    p.then(callback[1]);
    p.then(callback[2]);
    setTimeout(() => {
      assert(callback[0].called);
      assert(callback[1].called);
      assert(callback[2].called);
      assert(callback[1].calledAfter(callback[0]));
      assert(callback[2].calledAfter(callback[1]));
      done();
    }, 0);
  });
});
