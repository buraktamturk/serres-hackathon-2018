
module.exports = class {
	constructor(dataservice) {
		'ngInject';

		this.villages = dataservice.get();
	}

	save() {
		this.villages = dataservice.set(this.villages);
    }

    reset() {
    	this.villages = dataservice.reset();
    }

    refer(array, i, d) {
        var that = this;
        if(array && array.length && i < array.length) {
          return {
            get val() {
              return array[i];
            },

            set val(a) {
              if(a == d) {
                array.splice(i, 1);
                return d;
              } else {
                array[i] = a;
              }
            }
          };
        } else {
          return {
            a: d,

            get val() {
              return d;
            },

            set val(a) {
              if(a != d) {
                array.push(a);
              }
            }
          };
        }
    }
};
