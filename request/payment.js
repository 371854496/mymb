import Server from '../server/server.js';
import api from './api.js'

let $http = new Server();
let responseID = $http.interceptors.response.use(res => {
    return res;
})

let $payment = {};
export default $payment;

$payment.send = function(params,other) {
	return $http.post(api.payment_send,params,other)
}