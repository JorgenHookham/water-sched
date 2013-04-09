watersched.factory('storage_service', function () {

    // Configure the localstore DB:
    persistence.store.websql.config(persistence, 'watersched', 'Your plants watering schedules.', 5*1024*1024); // 5Mb

    var DataModel = persistence.define('MODEL_NAME', {
        id: 'INT'
    });

    persistence.schemaSync();

    var storage_service = {

        add: function (model) {
            persistence.add(model);
            persistence.flush();
        },

        remove: function (model) {
            DataModel.all().filter('id', '=', model.id).destroyAll();
        },

        fetchAll: function (collection, controller) {
            DataModel.all().list(function (models) {
                angular.forEach(models, function (model) {
                    collection.push(model._data);
                    controller.$digest();
                });
            });
        }
    };

    return storage_service;

});