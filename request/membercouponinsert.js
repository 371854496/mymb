import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $couponinsert = {};
export default $couponinsert;

$couponinsert.insert = function (params, other) {
  return $http.post(api.couponinsert_insert, params, other)
}
