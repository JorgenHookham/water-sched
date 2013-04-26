// jslint node:true
'use strict';

watersched.controller('PlantsCtrl',
    function PlantsCtrl ($scope, storage_service) {

        $scope.plants = [];

        storage_service.fetchAll($scope);

        $scope.addPlant = function () {
            var new_plant = { name: $scope.name, cycle_duration: $scope.cycle_duration };
            $scope.plants.push(new_plant);
            storage_service.add(new_plant);
            $scope.name = $scope.cycle_duration = '';
        };

        $scope.waterPlant = function (plant) {
            plant.cycle_origin = new Date();
            plant.cycle_destination = new Date(plant.cycle_origin.getTime() + parseInt(plant.cycle_duration, 10)*24*60*60*1000);
            storage_service.water(plant);
        };

        $scope.removePlant = function (plant) {
            $scope.plants.pop(plant);
            storage_service.remove(plant);
        };

        $scope.cycle_remaining = function (plant) {
            if (plant.cycle_origin) {
                var cycle_location  = new Date() - plant.cycle_origin,
                    cycle_duration  = (parseInt(plant.cycle_duration, 10)-1)*24*60*60*1000,
                    cycle_remaining = (cycle_duration - cycle_location) / cycle_duration * 100;
                return cycle_remaining;
            } else {
                return 0;
            }
        };

});