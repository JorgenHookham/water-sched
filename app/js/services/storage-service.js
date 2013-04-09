watersched.factory('storage_service', function () {

    // Configure the localstore DB:
    persistence.store.websql.config(persistence, 'watersched', 'Your house plant watering schedules.', 5*1024*1024); // 5Mb

    var Plant = persistence.define('Plant', {
        name: 'TEXT',
        water: 'TEXT',
        last_water: 'DATE'
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
            Plant.all().filter('name', '=', plant.name).one(function(plant){
                plant.last_water = new Date();
                persistence.flush();
            });
        }
    };

    return storage_service;

});