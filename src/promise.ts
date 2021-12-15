export default class MyPromise {
  success = null;
  fail = null;
  // 调用resolve（第一个参数）时，调用success方法
  resolve() {
    // 由于fn时立即执行的，所以还没等到then方法绑定success回调至实例，就执行了success
    // 因此设置延时，让then先执行，再执行resolve，从而执行success
    setTimeout(() => {
      if (typeof this.success === "function") {
        this.success();
      }
    }, 0);
  }
  // 调用reject（第二个参数）时，调用failed方法
  reject() {
    setTimeout(() => {
      if (typeof this.fail === "function") {
        this.fail();
      }
    }, 0);
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("我只接受函数啊");
    }
    // 绑定this，防止success的this丢失
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  // then 接受两个参数（回调函数），保存为实例属性
  then(success?, fail?) {
    if (typeof success === "function") {
      this.success = success;
    }
    if (typeof fail === "function") {
      this.fail = fail;
    }
  }
}
