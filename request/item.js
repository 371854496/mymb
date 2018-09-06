import Server from '../server/server.js';
import api from './api.js'


let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $item = {};
export default $item;
$item.list = function(params,other) {
    return $http.post(api.item_list, params,other);
}
$item.detail = function(params,other) {
    return $http.post(api.item_detail, params,other);
}
$item.listmarke = function (params, other) {
    return $http.post(api.item_listmarke, params, other);
}
$item.recommend = function (params, other) {
    return $http.post(api.item_recommend, params, other);
}
$item.countorder=function(params,other){
    return $http.post(api.item_countorder, params, other);
}


