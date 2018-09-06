const InterceptorManager = require('./interceptor-manager.js')
const dispatchRequest = require('./dispatch-request.js')
/**
 * Server 类，用来生成wx.request的server实例，有request的方法，参数同wx.request参数，不需要success和fail
 * 不推荐使用complete回调（可在then或catch调用，或者.finally里面调用），get和post，类似request，
 * @param {obj} istanceConfig -request的默认参数的设置，比如header等,设置的配置string类会被请求带的参数覆盖，header，data等obj类参数会合并
 */

module.exports = class Server {
    constructor(instanceConfig) {
        this.defaults = instanceConfig?instanceConfig:{};
        
        //实例的拦截器，有request和response 
        
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };

    }

    //request请求
    request(config) {
    	let promise = Promise.resolve(config);
    	let queque = [dispatchRequest.bind(null,this.defaults),undefined];
    	let reqInterceptor = this.interceptors.request.handlers;
    	let resInterceptor = this.interceptors.response.handlers;
    	reqInterceptor.forEach(obj=>{
            if(obj) {
                queque.unshift(obj.resolved,obj.rejected);
            }
    		
    	});
    	resInterceptor.forEach(obj=>{
            if(obj) {
                queque.push(obj.resolved,obj.rejected);;
            }	
    	});
    	while(queque.length) {
    		promise = promise.then(queque.shift(),queque.shift());
    	}
    	return promise;
    }

    //get请求
    get(config) {
    	config.method = 'GET';
    	return this.request(config);
    }

    //post请求
    post(config) {
    	config.method = 'POST';
    	return this.request(config);
    }
}