import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $itembargains = {};
export default $itembargains;

$itembargains.get = function (params, other) {
    return $http.post(api.itembargains_get, params, other)
}
$itembargains.list = function (params, other) {
    return $http.post(api.itembargains_list, params, other)
}
$itembargains.add = function (params, other) {
    return $http.post(api.itembargains_add, params, other)
}
$itembargains.edit = function (params, other) {
    return $http.post(api.itembargains_edit, params, other)
}