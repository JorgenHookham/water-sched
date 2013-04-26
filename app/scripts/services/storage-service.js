// jslint node:true
'use strict';

watersched.factory('storage_service', function () {

    // Configure the localstore DB:
    persistence.store.websql.config(persistence, 'watersched', 'Your house plant watering schedules.', 5*1024*1024); // 5Mb

    // require(['./vendors/persistencejs/persistence.migrations', './js/migrations/2013-04-10'], function (migrations_plugin, migration) {
    //     persistence.migrations.init(function () {
    //         persistence.migrate(1, function() {
    //             console.log('Migration\'s done!');
    //         });
    //     });
    // });

    // var Plant = persistence.define('Plant', {
    //     name: 'TEXT',
    //     water: 'TEXT',
    //     last_water: 'DATE'
    // });

    var Plant = persistence.define('Plant', {
        name: 'TEXT',
        cycle_origin: 'DATE',
        cycle_destination: 'DATE',
        cycle_duration: 'INT'
    });

    persistence.schemaSync();

    var storage_service = {

        add: function (plant) {
            persistence.add(new Plant(plant));
            persistence.flush();
        },

        remove: function (plant) {
            Plant.all().filter('name', '=', plant.name).destroyAll();
        },

        fetchAll: function (controller) {
            Plant.all().list(function (plants) {
                angular.forEach(plants, function (plant) {
                    controller.plants.push(plant._data);
                    controller.$digest();
                });
            });
        },

        water: function(plant){
            Plant.all().filter('name', '=', plant.name).one(function(plant_in_db){
                plant_in_db.cycle_origin = plant.cycle_origin;
                plant_in_db.cycle_destination = plant.cycle_destination;
                persistence.flush();
            });
        }
    };

    return storage_service;

});