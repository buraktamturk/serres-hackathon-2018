
var villages = [
	{
		name: 'Serres',
		location: {
			lat: 41.092083,
			lng: 23.541016
		},
		connections: ['Provatas', 'K. Mitrousi', 'Skoutari']
	},
	{
		name: 'Provatas',
		location: {
			lat: 41.068238,
			lng: 23.390686
		},
		connections: ['A. Kamila']
	},
	{
		name: 'A. Kamila',
		location: {
			lat: 41.058320,
			lng: 23.424134
		},
		connections: ['Koumaria']
	},
	{
		name: 'K. Kamila',
		location: {
			lat: 41.020431,
			lng: 23.483293
		}
	},
	{
		name: 'K. Mitrousi',
		location: {
			lat: 41.058680,
			lng: 23.457547
		},
		connections: ['A. Kamila', 'K. Kamila']
	},
	{
		name: 'Koumaria',
		location: {
			lat: 41.016434,
			lng: 23.434656
		}
	},
	{
		name: 'Skoutari',
		location: {
			lat: 41.020032,
			lng: 23.520701
		},
		connections: ['Peponia', 'Ag. Eleni']
	},
	{
		name: 'Adelfiko',
		location: {
			lat: 41.014645,
			lng: 23.457354
		}
	},
	{
		name: 'Ag. Eleni',
		location: {
			lat: 41.003545,
			lng: 23.559196
		},
		connections: ['Peponia']
	},
	{
		name: 'Peponia',
		location: {
			lat: 40.988154,
			lng: 23.516756
		},
		connections: ['Adelfiko']
	}
];

function apply_mutual_connections(villages) {
	for(var village of villages) {
		if(village.connections) {
			for(var connection of village.connections) {
				var target_village = villages.filter(a => a.name === connection)[0];

				if(target_village.connections) {
					if(target_village.connections.indexOf(village.name) == -1) {
						target_village.connections.push(village.name);
					}
				} else {
					target_village.connections = [village.name];
				}
			}
		}
	}
}

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

function all_visit(locations) {
	return villages.filter(a => locations.filter(b => b == a.name).length == 0).length == 0;
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

function go(loc, cost) {
	var locations = (loc.connections || [])
		.filter(a => following_taken(cost.locations, loc.name, a) < 1);

	if(locations.length == 0) {
		return cost;
	}

	locations = locations.map(a => go(villages.filter(b => b.name == a)[0], {
			cost: (cost && cost.cost || 0) + apply_cost(loc, a),
			locations: ((cost && cost.locations) || []).concat([a])
		}))
		.filter(a => a && a.locations[a.locations.length - 1] == 'Adelfiko');

	var new_cost = locations.sort((a, b) => a.cost - b.cost)[0];

	return new_cost || (all_visit(cost.locations) && loc.name == "Adelfiko" && cost);
}

apply_mutual_connections(villages);

module.exports = class {
	constructor() {
		apply_mutual_connections(villages);

		this.villages = villages;
		this.start = villages[0];

		this.dustbin_filter = false;
		this.dustbins = [villages[5], villages[6], villages[9], villages[1]];

		this.after_enabled = false;
		this.after = 2;
		this.after_dustbins = [villages[2], villages[4]];


	}

	calc() {
		try {
		this.result = go(villages[0], {
			cost: 0,
			locations: ['Serres']
		});

		console.log(this.result);
	} catch(e) {
		console.error(e);
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
