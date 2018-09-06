import Server from '../server/server.js';
import api from './api.js'


let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $swiper = {};
export default $swiper;
$swiper.list = function (params, other) {
  return $http.post(api.swiper_list, params, other);
}
