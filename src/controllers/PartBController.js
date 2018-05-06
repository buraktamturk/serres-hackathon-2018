var villages;
var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

function apply_cost( loc1, loc2 ) {
	return getDistance(loc1.location, villages.filter(a => loc2 == a.name)[0].location);
}

function apply_dump( loc1, loc2, force_weigth_enabled, force_weigth ) {

	loc2 = villages.filter(a => loc2 == a.name)[0];

	if(force_weigth_enabled && loc2.bin_weight) {
		return force_weigth;
	}


	return loc2.bin_weight || 0;
}

function all_visit(locations, collected,force_weigth_enabled, force_weigth) {
	return all_visit_algo_2(locations, collected);
	//return villages.filter(a => locations.filter(b => b == a.name).length == 0).length == 0;
//	var all_visit = villages.filter(a => a.bin_weight && collected[a.name] && (collected[a.name] < a.bin_weight)).length == 0;
//	if(all_visit) {
//		console.log(collected);
//	}
//	return all_visit;
}

function all_visit_algo_2(locations, collected,force_weigth_enabled, force_weigth) {
//	return villages.filter(a => locations.filter(b => b == a.name).length == 0).length == 0;
	var all_visit = villages.filter(a => a.bin_weight && (!collected[a.name] || (collected[a.name] < (force_weigth_enabled ? force_weigth : a.bin_weight)))).length == 0;
	//if(all_visit) {
	//	console.log(collected);
	//}
	return all_visit;
}


function following_taken(history, loc1, loc2) {
	var count = 0;

	var old_index = 0, loc = -1;
	do {
		loc = history.indexOf(loc1, old_index);
		if(loc != -1) {
			old_index = loc + 1;
			if(history.length >= loc && history[loc + 1] == loc2) {
				++count;
			}
		}
	} while(loc != -1);

	return count;
}

function extend_collected_dump(old, name, count) {
	var new_obj = {};

	for(var key in old) {
		new_obj[key] = old[key];
	}

	new_obj[name] = (new_obj[name] || 0) + count;

	return new_obj;
}

function go(loc, cost, options, collected) {
	if(cost == null) {
		cost = {
			cost: 0,
			dump: 0,
			locations: [
				{ collected: collected, name: loc.name, cost: 0, total_cost: 0, dump: apply_dump(null, loc.name, options.force_weigth_enabled, options.force_weigth), total_dump: apply_dump(null, loc.name, options.force_weigth_enabled, options.force_weigth) }
			]
		};
	}

	if(collected == null) {
		collected = {};
	}

	if(options == null) {
		options = {};
	}

	var locations = (loc.connections || [])
		.filter(a => following_taken(cost.locations.map(b => b.name), loc.name, a) < 1);

	if(locations.length == 0) {
		return cost;
	}

	locations = locations
		.map(a => go(villages.filter(b => b.name == a)[0], {
			cost: (cost && cost.cost || 0) + apply_cost(loc, a),
			locations: ((cost && cost.locations) || []).concat([{collected: extend_collected_dump(collected, a, apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0)), name: a, cost: apply_cost(loc, a), total_cost: (cost && cost.cost || 0) + apply_cost(loc, a), total_dump: ((cost && cost.dump) || 0) + apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0), dump: apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0)}]),
			dump: ((cost && cost.dump) || 0) + apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0),
			collected: extend_collected_dump(collected, a, apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0))
		}, options, extend_collected_dump(collected, a, apply_dump(loc, a, options.force_weigth_enabled, options.force_weigth) - (collected[a] || 0))))
		.filter(a => a && a.locations[a.locations.length - 1].name == 'Adelfiko');

	var new_cost = locations.sort((a, b) => a.cost - b.cost)[0];

	return new_cost || (all_visit(cost.locations.map(a => a.name), collected, options.force_weigth_enabled, options.force_weigth) && loc.name == "Adelfiko" && cost);
}

module.exports = class {
	constructor(dataservice) {
		'ngInject';

		villages = this.villages = dataservice.get();
		this.start = this.villages[0];

		this.force_weigth_enabled = false;
		this.force_weigth = 100;

		this.dustbin_filter = false;
		this.dustbins = [this.villages[5], this.villages[6], this.villages[9], this.villages[1]];

		this.after_enabled = false;
		this.after = 2;
		this.after_dustbins = [this.villages[2], this.villages[4]];
	}

	calc() {
		var t0 = (performance && performance.now()) || 0;
		try {
			var collected = {};

			if(this.dustbin_filter) {
				for(var village of this.villages) {
					if(this.dustbins.indexOf(village) == -1) {
						collected[village.name] = this.force_weigth_enabled ? Number(this.force_weigth) : village.bin_weight;
					}
				}
			}

			this.result = go(this.start, null, {
				force_weigth_enabled: this.force_weigth_enabled,
				force_weigth: Number(this.force_weigth)
			}, collected);

			if(this.result && this.after_enabled) {
				var point = this.result.locations[this.after ];
				console.log(point);

				var collected = point.collected;

				console.log("old collected: ", collected);

				for(var new_dump_village of this.after_dustbins) {
					collected = extend_collected_dump(collected, new_dump_village.name, -new_dump_village.bin_weight);
				}

				console.log("new collected: ", collected);

				this.result = go(this.villages.filter(a => a.name == point.name)[0], {
					cost: point.total_cost,
					dump: point.total_dump,
					collected: collected,
					locations: this.result.locations.filter((a,i) => i <= this.after)
				}, {
					force_weigth_enabled: this.force_weigth_enabled,
					force_weigth: Number(this.force_weigth)
				}, collected);
			}

			var t1 = (performance && performance.now()) || 0;
			if(this.result) {
				this.result.time = t1 - t0;
			} else {
				alert("no solutions found for this route!");
			}

			console.log(this.result);
		} catch(e) {
			console.log(e);
		}
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
