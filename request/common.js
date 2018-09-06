import Server from '../server/server.js';
const opts = {
  // baseURL:'http://192.168.199.174:8080', //'http://192.168.199.174:8080',//周晓航
  baseURL: 'http://testapi.lormi.net'//'http://192.168.199.174:8080' //凡人之家正式
};
const $http = new Server(opts);
$http.interceptors.request.use(res => {
  if (res.data.openid !== undefined) {
    if (res.data.openid === '') {
      wx.redirectTo({
        url: '/pages/mine/authorize/index',
      })
    }
    return res;
  }
  return res;
})
$http.interceptors.response.use(res => {
  if (res.statusCode >= 200 && res.statusCode < 400) {
    return res.data;
  } else {
    wx.showToast({
      title: '服务器异常',
      icon: 'none',
      duration: 2000
    })
    return {
      data: null,
      msg: res.data ? res.data.msg : '服务器异常',
      totalcount: res.data ? res.data.totalcount : '0'
    }
  }

});
module.exports = $http;