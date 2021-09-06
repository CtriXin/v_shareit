/*
  demo a: 返回简单的json数据，变量语法可参考 http://mockjs.com/examples.html
 */

  module.exports = {
    url: '/external/wallpaper/list',
    method: 'get',
    result: {
      'code': '200',
      'data': {
       
        'hasNext|1': false,
        source:[
          
        ],
        time:"@time",
        img: "@image(20x20)",
        subType: "@datetime()"
      }
    }
  }