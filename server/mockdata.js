const faker = require("faker");
const db = require("./models");

async function create_mockdata(n) {
    for (i = 0; i < n; i++) {
        await db.feedback.create({ content: faker.lorem.sentence() });

        await db.lost_property.create({
            found_on: faker.date.recent(),
            type: faker.lorem.word(),
            desc: faker.lorem.sentence(2),
        });

        fn = faker.name.firstName();
        ln = faker.name.lastName();
        citizen = await db.citizen.create({
            first_name: fn,
            last_name: ln,
            street: faker.address.streetName(),
            building_number: faker.helpers.regexpStyleStringParse("[0-1420]"),
            email: faker.internet.email(fn, ln),
            phone: faker.phone.phoneNumber("+49 ### ## ## ##"),
        });

        await citizen.createAppointment({
            time: faker.helpers.regexpStyleStringParse("[0-24]:[0-59]:[0-59]"),
            issue: faker.lorem.word(),
        });

        await citizen.createRequest({
            type: faker.lorem.word(),
            desc: faker.lorem.sentence(2),
        });
    }
}

module.exports = { create_mockdata };
