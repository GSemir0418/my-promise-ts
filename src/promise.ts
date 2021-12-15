export default class MyPromise {
  callbacks = [];
  state = "pending";
  resolve(result) {
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.callbacks.forEach((handler) => {
        if (typeof handler[0] === "function") {
          handler[0].call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    setTimeout(() => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.callbacks.forEach((handler) => {
        if (typeof handler[1] === "function") {
          handler[1].call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接受函数啊");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(success?, fail?) {
    const handler = [];
    if (typeof success === "function") {
      handler[0] = success;
    }
    if (typeof fail === "function") {
      handler[1] = fail;
    }
    this.callbacks.push(handler);
  }
}
