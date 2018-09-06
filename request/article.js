import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $article = {};
export default $article;

//params 需要openid
$article.list = function(params,other) {
	return $http.post(api.article_list,params,other)
}