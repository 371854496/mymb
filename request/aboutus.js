import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $aboutus = {};
export default $aboutus;

$aboutus.list = function (params, other) {
  return $http.post(api.aboutus_list, params, other)
}
