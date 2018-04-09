{
    init: function(elevators, floors) {
        console.clear();
        var goingup = [];
        var goingdown = [];
        var next = [];        

        for (var i in elevators){
            init_elevator(elevators[i], i);
        }
        
        for (var i in floors){
            init_floor(floors[i]);
        }
        
        function next_scrub(floor){
            var tmp = [];
            for (var i=1; i<next.length; i++){
                if (next[i] != floor){tmp.push(next[i]);}
            }
            return tmp;
        }
        
        function init_floor(floor){
            floor.on("up_button_pressed", function() {
                goingup[floor.level] = true;
                next.push(floor.level);
            });
            floor.on("down_button_pressed", function() {
                goingdown[floor.level] = true;
                next.push(floor.level);
            });
        }

        function init_elevator(elevator, i){
            elevator.on("idle", function() {
                if (next.length > 0){
                    elevator.goToFloor(next[0]);
                    next = next_scrub(next[0]);
                } else {
                    elevator.goToFloor(0);
                }
            });
            elevator.on("floor_button_pressed", function(floor){
                var places = elevator.getPressedFloors();
                var z;
                for (z=0; z<places.length; z++){
                    if (elevator.currentFloor() <= places[z]) {
                        break;
                    }
                }
                elevator.destinationQueue = places.splice(z).concat(places.splice(0,z).reverse());
                elevator.checkDestinationQueue();
                if (next[0]==floor){
                    next = next_scrub(floor);
                }
            });
            elevator.on("passing_floor", function(floor, direction){
                if (direction=="up" && goingup[floor] && elevator.loadFactor() < 0.2){
                    elevator.goToFloor(floor, true);
                    goingup[floor] = false;
                    if (next[0] == floor) {next = next_scrub(floor);}
                }
                else if (direction=="down" && goingdown[floor] && elevator.loadFactor() < 0.2){
                    elevator.goToFloor(floor, true);
                    goingdown[floor] = false;
                    if (next[0] == floor) {next = next_scrub(floor);}
                }
                
            });
            elevator.on("stopped_at_floor", function(floor){
                if(next[0] == floor){
                    next = next_scrub(floor);
                }
                goingdown[floor] = false;
                goingup[floor] = false;
            });
        };

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
