import $http from './common.js';
import api from './api.js'

export default {
  list(params, other) {
    return $http.post(api.indexitemlist, params, other);
  }
};
