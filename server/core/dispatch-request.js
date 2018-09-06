const promisify = require('../utils/promisify.js');

const buildURL = require('../utils/build-url.js');

const dispatchRequest = function (defaults,config){
	let res = {};
	let deHeader = defaults.header;
	let header = config.header;
	let baseURL;
	let relativeURL;
	if(deHeader&&header) {
		res.header = Object.assign({},deHeader,header);
	}
	if(defaults.data&&config.data) {
		res.data = Object.assign({},defaults.data,config.data);
	}
	res = Object.assign({},defaults,config,res);
	baseURL = res.baseURL;
	relativeURL = res.url;
	res.url=baseURL?buildURL(baseURL,relativeURL):relativeURL;
	delete res.baseURL;
	return promisify(wx.request)(res);
}
module.exports = dispatchRequest;