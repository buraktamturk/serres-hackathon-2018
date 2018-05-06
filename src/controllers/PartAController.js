
module.exports = class {
	constructor(dataservice) {
		'ngInject';

		this.villages = dataservice.get();
	}
};
