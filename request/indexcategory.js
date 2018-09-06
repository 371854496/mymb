import Server from '../server/server.js';
import api from './api.js'


let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $indexcategory = {};
export default $indexcategory;
$indexcategory.recommend = function (params, other) {
  return $http.post(api.indexcategory_recommend, params, other);
}
