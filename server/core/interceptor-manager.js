module.exports = class InterceptorManager {
	constructor() {
		this.handlers = [];
	}
	use(resolved,rejected) {
		this.handlers.push({
			resolved,
			rejected
		});
		return this.handlers.length-1;
	}
	eject(id) {
		if(this.handlers[id]) {
			this.handlers[id] = null;
		}
	}
}