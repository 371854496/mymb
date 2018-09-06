import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $itemevaluate = {};
export default $itemevaluate;

$itemevaluate.add = function (params, other) {
    return $http.post(api.itemevaluate_add, params, other)
}
$itemevaluate.list = function (params, other) {
    return $http.post(api.itemevaluate_list, params, other)
}