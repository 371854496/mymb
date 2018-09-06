import Server from '../server/server.js';
import api from './api.js'


let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $itemgroupon = {};
export default $itemgroupon;
$itemgroupon.list = function (params, other) {
    return $http.post(api.itemgroupon_list, params, other);
}
$itemgroupon.get = function (params, other) {
    return $http.post(api.itemgroupon_get, params, other);
}