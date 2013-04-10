// jslint node:true
'use strict';

watersched.controller('PlantsCtrl',
    function PlantsCtrl ($scope, storage_service) {

        $scope.plants = [];

        storage_service.fetchAll($scope);

        $scope.addPlant = function () {
            var new_plant = { name: $scope.name, water: $scope.water };
            $scope.plants.push(new_plant);
            storage_service.add(new_plant);
            $scope.name = $scope.water = '';
        };

        $scope.waterPlant = function (plant) {
            plant.last_water = new Date();
            storage_service.water(plant);
        };

        $scope.removePlant = function (plant) {
            $scope.plants.pop(plant);
            storage_service.remove(plant);
        };

        $scope.next_water_day = function (plant) {
            return new Date(plant.last_water.getTime() + plant.water*24*60*60*1000);
        };

});