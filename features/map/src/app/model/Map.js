define(['app/utils/events'], function(EventEmitter) {
    class Map {
        constructor(platform, eventBus) {
            this.paths = [{ type: 'foot', points: [] }];
            this.events = new EventEmitter('MapModel');
            this.state -1;
        }

        moveTo(point) {
            if (this.paths[this.paths.length - 1].points.length === 0) {
                this.paths[this.paths.length - 1].points.push(point);

                this.events.trigger('move', { point });
            } else {
                let last = this.paths[this.paths.length - 1].points[this.paths[this.paths.length - 1].points.length - 1];
                if (last.x !== point.x || last.y !== point.y || last.z !== point.z) {
                    this.paths[this.paths.length - 1].points.push(point);

                    this.events.trigger('move', { point });
                }
            }
        }

        setState(v) {
            this.state = v;

            if (this.state === 0) {
                this.reset();
            }
        }

        reset() {
            this.paths = [{ type: 'foot', points: [] }];
        }

        break(isVehicle) {
            this.paths.push({
                type: isVehicle ? 'vehicle' : 'foot',
                points: []
            });
        }
    }

    return Map;
});