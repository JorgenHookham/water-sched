define([

    '../../vendors/persistencejs/persistence'

], function () {

    /*
     * Each time a plant is watered, it begins a new watering cycle.
     * Cycle Origin is the date and time of beginning of the cycle.
     * Cycle Destination is date and time of the end of the cycle.
     * Cycle Duration is number of days between the origin and destination.
     *
     * This migration updates the Plant data model to have these attributes.
     */

    persistence.defineMigration(1, {

        // var Plant = persistence.define('Plant', {
        //     name: 'TEXT',
        //     water: 'TEXT',
        //     last_water: 'DATE'
        // });

        // var Plant = persistence.define('Plant', {
        //     name: 'TEXT',
        //     cycle_origin: 'DATE',
        //     cycle_destination: 'DATE',
        //     cycle_duration: 'INT'
        // });

        up: function () {
            
            console.log('Migrate up.');

            // Old plant data model
            var Plant = persistence.define('Plant', {
                name: 'TEXT',
                water: 'TEXT',
                last_water: 'DATE'
            });

            // Create the new columns
            // this.addColumn('Plant', 'cycle_origin', 'DATE');
            // this.addColumn('Plant', 'cycle_destination', 'DATE');
            // this.addColumn('Plant', 'cycle_duration', 'INT');

            this.action(function (tx, nextAction) {
                Plant.all().list(function (plants) {
                    plants.forEach(function (plant) {

                        // Copy values from old columns
                        plant._data.cycle_origin = plant._data.last_water;
                        plant._data.cycle_duration = parseInt(plant._data.water, 10);
                        plant._data.cycle_destination = new Date(plant._data.last_water.getTime() + parseInt(plant._data.water, 10)*24*60*60*1000);
                        console.log(plant);

                    });
                    persistence.flush(tx, function() {
                      nextAction();
                    });
                });
            });

            // Remove the old columns
            this.removeColumn('Plant', 'water');
            this.removeColumn('Plant', 'last_water');

            // New plant data model
            Plant = persistence.define('Plant', {
                name: 'TEXT',
                cycle_origin: 'DATE',
                cycle_destination: 'DATE',
                cycle_duration: 'INT'
            });
        },

        down: function () {
            console.log('Migrate down.');
            // Replace the old columns
            // this.addColumn('Plant', 'water', 'TEXT');
            // this.addColumn('Plant', 'last_water', 'DATE');

            this.action(function (tx, nextAction) {
                Plant.all().list(function (plants) {
                    plants.forEach(function (plant) {
                        console.log(plant);
                    });
                });
            });

            // Remove the new columns
            this.removeColumn('Plant', 'cycle_origin');
            this.removeColumn('Plant', 'cycle_destination');
            this.removeColumn('Plant', 'cycle_duration');
        }

    });

});