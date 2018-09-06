const InterceptorManager = require('./core/interceptor-manager.js')
const dispatchRequest = require('./core/dispatch-request.js')
const extData = {};
const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
const testAppid ="wxd5461c8f6b8afb9f";
const testSecret ="eebe12bfab2511e8ad7c246e96416250";
//112e3ace9f9a11e8b2df00163e0e3337测试
//wx59a59d53c7f962b0
//https://api.meisaas.com/
/*https://testapi.apimei.com/*/
/*192.168.199.230:8080 */
/**
 * Server 类，用来生成wx.request的server实例，有request的方法，参数同wx.request参数，不需要success和fail
 * 不推荐使用complete回调（可在then或catch调用，或者.finally里面调用），get和post，类似request，
 * @param {obj} istanceConfig -request的默认参数的设置，比如header等,设置的配置string类会被请求带的参数覆盖，header，data等obj类参数会合并
 */

module.exports = class Server {
  constructor(instanceConfig) {
    this.defaults = instanceConfig ? instanceConfig : {};
    if (!this.defaults.baseURL) {
      this.defaults.baseURL = extData.host ? extData.host : 'https://api.meisaas.com/';
    }
    if (!this.defaults.data) {
      this.defaults.data = {
          appid: extData.appid ? extData.appid : testAppid,
          secret: extData.secret ? extData.secret : testSecret
      };
    } else if (!this.defaults.data.appid) {
        this.defaults.data.appid = extData.appid ? extData.appid : testAppid
    } else if (!this.defaults.data.secret){
        this.defaults.data.secret = extData.secret ? extData.secret : testSecret
    }
    if (!this.defaults.header) {
      this.defaults.header = {
        'content-type': contentType
      }
    } else if (!this.defaults.header['content-type']) {
      this.defaults.header['content-type'] = contentType
    }
    //实例的拦截器，有request和response 
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  //request请求
  request(config) {
    let promise = Promise.resolve(config);
    let queque = [dispatchRequest.bind(null, this.defaults), undefined];
    //console.log('config', this.defaults);
    let reqInterceptor = this.interceptors.request.handlers;
    let resInterceptor = this.interceptors.response.handlers;
    reqInterceptor.forEach(obj => {
      if (obj) {
        queque.unshift(obj.resolved, obj.rejected);
      }

    });
    resInterceptor.forEach(obj => {
      if (obj) {
        queque.push(obj.resolved, obj.rejected);;
      }
    });
    while (queque.length) {
      promise = promise.then(queque.shift(), queque.shift());
    }
    
    return promise;
  }

  //get请求
  get(url, data, other) {
    let config = {
      url,
      method: 'GET'
    };
    let tData = data ? data : {};
    let tOther = other ? other : {};
    config.data = tData;
    config = Object.assign({}, tOther, config);
    return this.request(config);
  }

  //post请求
  post(url, data, other) {
    let config = {
      url,
      method: 'POST'
    };
    let tData = data ? data : {};
    //1.判断openid是否需要
    //2.如果需要，判断openid是否为空
    //3.如果为空，并且openid缓存也为空，去授权
    if (tData.openid!==undefined){
        if (tData.openid===''){
            if (wx.getStorageSync('openid')!==''){
                tData.openid = wx.getStorageSync('openid');
            }else{
                wx.redirectTo({
                    url: '/pages/mine/authorize/index',
                })
                return Promise.resolve(false);
            }
            
        }
    }
    let tOther = other ? other : {};
    config.data = tData;
    config = Object.assign({}, tOther, config);
 
    return this.request(config);
  }
}