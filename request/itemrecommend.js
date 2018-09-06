import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $itemrecommend = {};
export default $itemrecommend;

$itemrecommend.recommend = function (params, other) {
  return $http.post(api.itemrecommend_recommend, params, other)
}
