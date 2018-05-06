
var default_data = [
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
    bin_weight: 60,
    location: {
      lat: 41.068238,
      lng: 23.390686
    },
    connections: ['A. Kamila']
  },
  {
    name: 'A. Kamila',
    bin_weight: 40,
    location: {
      lat: 41.058320,
      lng: 23.424134
    },
    connections: ['Koumaria']
  },
  {
    name: 'K. Kamila',
    bin_weight: 40,
    location: {
      lat: 41.020431,
      lng: 23.483293
    }
  },
  {
    name: 'K. Mitrousi',
    bin_weight: 160,
    location: {
      lat: 41.058680,
      lng: 23.457547
    },
    connections: ['A. Kamila', 'K. Kamila']
  },
  {
    name: 'Koumaria',
    bin_weight: 50,
    location: {
      lat: 41.016434,
      lng: 23.434656
    }
  },
  {
    name: 'Skoutari',
    bin_weight: 200,
    location: {
      lat: 41.020032,
      lng: 23.520701
    },
    connections: ['Peponia', 'Ag. Eleni']
  },
  {
    name: 'Adelfiko',
    final_destination: true,
    location: {
      lat: 41.014645,
      lng: 23.457354
    }
  },
  {
    name: 'Ag. Eleni',
    bin_weight: 100,
    location: {
      lat: 41.003545,
      lng: 23.559196
    },
    connections: ['Peponia']
  },
  {
    name: 'Peponia',
    bin_weight: 150,
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

apply_mutual_connections(default_data);

module.exports = require('angular')
    .module('serres-hackathon-2018.data', [])
    .factory('dataservice', function() {
      'ngInject';

      return {
        get() {
          return localStorage.getItem('data') || default_data;
        },

        set(data) {
          localStorage.setItem('data', data);
          return data;
        },

        reset() {
          localStorage.removeItem('data');
          return default_data;
        }
      };
    })
    .name;
