const moment = require("moment");

export default function cw(week = 0) {
    if (week == 0) {
        var date = new Date();
    } else {
        var date = new Date(
            moment()
                .add(week * 7, "days")
                .calendar()
        );
    }

    // Monday: ((1+6) % 7) = 0
    // Tuesday ((2+6) % 7) = 1
    // Wednesday: ((3+6) % 7) = 2
    // Thursday: ((4+6) % 7) = 3
    // Friday: ((5+6) % 7) = 4
    // Saturday: ((6+6) % 7) = 5
    // Sunday: ((0+6) % 7) = 6
    var day = (date.getDay() + 6) % 7;
    var mon = moment(date).subtract(day, "days").format("YYYY-MM-DD");
    var sun = moment(date)
        .subtract(day, "days")
        .add(6, "days")
        .format("YYYY-MM-DD");
    var cur_th = new Date(date.getTime() + (3 - day) * 86400000);

    // At the beginnig or end of a year the thursday could be in another year.
    var year_of_th = cur_th.getFullYear();

    // Get first Thursday of the year
    var first_th = new Date(
        new Date(year_of_th, 0, 4).getTime() +
            (3 - ((new Date(year_of_th, 0, 4).getDay() + 6) % 7)) * 86400000
    );

    // +1 we start with week number 1
    // +0.5 an easy and dirty way to round result (in combinationen with Math.floor)
    var week = Math.floor(
        1 + 0.5 + (cur_th.getTime() - first_th.getTime()) / 86400000 / 7
    );

    return { week: week, mon: mon, sun: sun };
}
