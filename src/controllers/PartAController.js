
function apply_mutual_connections(villages) {
	for(var village of villages) {
		if(village.connections) {
			for(var connection of village.connections) {
				var target_village = villages.filter(a => a.name === connection)[0];

				if(target_village.connections) {
					target_village.connections.push(village.name);
				} else {
					target_village.connections = [village.name];
				}
			}
		}
	}
}

module.exports = class {
	constructor() {
		this.villages = [
			{
				name: 'Serres',
				location: {
					lat: 41.092083,
					lng: 23.541016
				}
			},
			{
				name: 'Provatas',
				location: {
					lat: 41.068238,
					lng: 23.390686
				},
				connections: ['Serres']
			},
			{
				name: 'A. Kamila',
				location: {
					lat: 41.058320,
					lng: 23.424134
				},
				connections: ['Provatas', 'K. Mitrousi']
			},
			{
				name: 'K. Kamila',
				location: {
					lat: 41.020431,
					lng: 23.483293
				},
				connections: ['K. Mitrousi']
			},
			{
				name: 'K. Mitrousi',
				location: {
					lat: 41.058680,
					lng: 23.457547
				},
				connections: ['Serres']
			},
			{
				name: 'Koumaria',
				location: {
					lat: 41.016434,
					lng: 23.434656
				},
				connections: ['A. Kamila', 'K. Mitrousi']
			},
			{
				name: 'Skoutari',
				location: {
					lat: 41.020032,
					lng: 23.520701
				},
				connections: ['Serres']
			},
			{
				name: 'Adelfiko',
				location: {
					lat: 41.014645,
					lng: 23.457354
				},
				connections: ['Koumaria', 'Peponia']
			},
			{
				name: 'Ag. Eleni',
				location: {
					lat: 41.003545,
					lng: 23.559196
				},
				connections: ['Peponia', 'Skoutari']
			},
			{
				name: 'Peponia',
				location: {
					lat: 40.988154,
					lng: 23.516756
				},
				connections: ['Skoutari']
			}
		];

		apply_mutual_connections(this.villages);
	}
};
