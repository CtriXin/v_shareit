/*
  demo a: 返回简单的json数据，变量语法可参考 http://mockjs.com/examples.html
 */

module.exports = {
  url: '/a',
  method: 'get',
  result: {
    'status|1': ["no_login", "OK", "error", "not_registered", "account_reviewing"],
    'msg': '200',
    'data': {
      a: 2,
			time:"@time",
			img: "@image(20x20)",
			subType: "@datetime()"
    }
  }
}