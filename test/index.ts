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
    // 如果没有传递函数，就会报错
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
    const p = new MyPromise((resolve, reject) => {
      // 断言，在resolve执行前，success不会执行
      assert.isFalse(success.called);
      resolve();
      // 之所以设置定时器，是因为resolve的过程是异步的，等待then执行后将success绑定到实例对象，再执行success
      setTimeout(() => {
        // 断言，在resolve后，success才会执行
        assert(success.called);
        // 保证代码执行完毕才算测试结束
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
});
