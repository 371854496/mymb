import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $ordergroupon = {};
export default $ordergroupon;
//params 的字段为parentid(int)
$ordergroupon.list = function (params, other) {
    return $http.post(api.ordergroupon_list, params, other);
}
$ordergroupon.get = function (params, other) {
    return $http.post(api.ordergroupon_get, params, other);
}
$ordergroupon.check = function (params, other) {
    return $http.post(api.ordergroupon_check, params, other);
}
