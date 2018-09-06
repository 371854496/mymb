import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $appointment = {};
export default $appointment;

//params 需要openid
$appointment.get = function (params, other) {
    return $http.post(api.appointment_get, params, other)
}