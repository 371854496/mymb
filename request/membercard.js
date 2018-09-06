import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $membercard = {};
export default $membercard;
$membercard.get = function (params, other) {
    return $http.post(api.membercard_get, params, other);
}