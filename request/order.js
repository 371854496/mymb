import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $order = {};
export default $order;
$order.createserve = function (params, other) {
    return $http.post(api.order_createserve, params, other);
}
$order.createvirtual = function (params, other) {
    return $http.post(api.order_createvirtual, params, other);
}
$order.listvirtual = function (params, other) {
    return $http.post(api.order_listvirtual, params, other);
}
$order.createmarke = function (params, other) {
    return $http.post(api.order_createmarke, params, other);
}
$order.checkordermodel = function (params, other) {
    return $http.post(api.order_checkordermodel, params, other);
}
$order.createcoupon = function (params, other) {
    return $http.post(api.order_createcoupon, params, other);
}
$order.list = function (params, other) {
    return $http.post(api.order_list, params, other);
}
$order.del = function (params, other) {
    return $http.post(api.order_del, params, other);
}
$order.update = function (params, other) {
    return $http.post(api.order_update, params, other);
}