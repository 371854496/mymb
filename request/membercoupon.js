import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $membercoupon = {};
export default $membercoupon;
//params 的字段为parentid(int)
$membercoupon.list = function (params, other) {
    return $http.post(api.membercoupon_list, params, other);
}
$membercoupon.add = function (params, other) {
    return $http.post(api.membercoupon_add, params, other);
}
