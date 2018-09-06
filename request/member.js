import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res.data;
})

let $member = {};
export default $member;
$member.login = function(params, other) {
    return $http.post(api.member_login, params, other);
}
$member.userinfo = function(params, other) {
    return $http.post(api.member_userinfo, params, other);
}
$member.phonenumber = function (params, other) {
    return $http.post(api.member_phonenumber, params, other);
}