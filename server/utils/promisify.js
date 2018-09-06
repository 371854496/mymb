function promisify(fn) { 
  return function (obj = {},...params) {   
    return new Promise((resolve, reject) => {     
      obj.success = resolve;
 	  obj.fail = reject;
      fn(obj,...params);   
    }) 
  }
}
 
module.exports = promisify;