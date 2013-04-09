watersched.factory('storage_service', function () {

    // Configure the localstore DB:
    persistence.store.websql.config(persistence, 'watersched', 'Your plants watering schedules.', 5*1024*1024); // 5Mb

    var Plant = persistence.define('Plant', {
        name: 'TEXT',
        water: 'TEXT',
        last_water: 'DATE'
    });

    persistence.schemaSync();

    var storage_service = {

        add: function (model) {
            persistence.add(model);
            persistence.flush();
        },

        remove: function (model) {
            Plant.all().filter('name', '=', model.name).destroyAll();
        },

        fetchAll: function (collection, controller) {
            Plant.all().list(function (models) {
                angular.forEach(models, function (model) {
                    collection.push(model._data);
                    controller.$digest();
                });
            });
        }
    };

    return storage_service;

});