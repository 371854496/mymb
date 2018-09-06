function mergeUrl(baseURL,relativeURL) {
	return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

module.exports = function buildURL(baseURL,relativeURL) {
	// console.log('baseURL',baseURL,'relativeURL',relativeURL)
	let isAbsolute = /(https|http):\/\//
	return isAbsolute.test(relativeURL)?relativeURL:mergeUrl(baseURL,relativeURL)
}