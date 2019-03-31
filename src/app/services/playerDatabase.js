define(function() {
    const db = {
        unknown: [],
        dominated: [],
        neutral: [],
        rabbit: []
    };

    return {
        load,
        select
    };

    function reset() {
        db.unknown = [];
        db.dominated = [];
        db.neutral = [];
        db.rabbit = [];
    }

    function load(data) {
        reset();

        for (let pl in data.players) {
            db.neutral.push(pl);
        }
    }

    function select(name) {
        let r = Math.random();
        if (r < 0.25) {
            return 'dominated';
        } else if (r < 0.5) {
            return 'neutral';
        } else if (r < 0.75) {
            return 'rabbit';
        } else {
            return 'unknown';
        }
        if (db.dominated.indexOf(name) > -1) {
            return 'dominated';
        } else if (db.neutral.indexOf(name) > -1) {
            return 'neutral';
        } else if (db.rabbit.indexOf(name) > -1) {
            return 'rabbit';
        } else {
            return 'unknown';
        }
    }
});