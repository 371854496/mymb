import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $category = {};
export default $category;
//params 的字段为parentid(int)
$category.list = function(params,other) {
	return $http.post(api.category_list, params,other);
}
$category.recommend = function (params, other) {
    return $http.post(api.category_recommend, params, other);
}


