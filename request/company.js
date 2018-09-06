import Server from '../server/server.js';
import api from './api.js';
let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $company = {};
export default $company;

//params可以不传
$company.contact= function(params, other) {
    return $http.post(api.company_contact, params, other)
}