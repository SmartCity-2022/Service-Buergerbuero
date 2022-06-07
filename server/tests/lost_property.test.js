const supertest = require("supertest");
const { app } = require("../index");

describe("lost_property", () => {
    const type = "test_type";
    let test_lps = [];
    describe("post", () => {
        describe("given a correct object is passed", () => {
            it("should save the obj in the database", async () => {
                const lp = { type: type, desc: "this is a test tuple" };
                const res = await supertest(app)
                    .post("/lost_property/")
                    .send(lp);
                expect(res.statusCode).toBe(201);
                const lp_2 = { type: type, desc: "this is also a test tuple" };
                const res_2 = await supertest(app)
                    .post("/lost_property/")
                    .send(lp_2);
                expect(res_2.statusCode).toBe(201);
            });
        });
    });
    describe("get", () => {
        describe("given no type parameter is set", () => {
            it("should return the whole table", async () => {
                const res = await supertest(app).get("/lost_property");
                expect(res.statusCode).toBe(200);
            });
        });
        describe("given the type parameter is set", () => {
            it("should return only tuples with that type", async () => {
                const res = await supertest(app).get(
                    `/lost_property?type=${type}`
                );
                expect(res.statusCode).toBe(200);
                test_lps = res.body;
                let correct = true;
                test_lps.forEach((e) => {
                    if (e.type != type) {
                        correct = false;
                    }
                });
                expect(correct).toBe(true);
            });
        });
    });
    describe("delete", () => {
        describe("given a correct id parameter is set", () => {
            it("should the tuple should be deleted", async () => {
                const id_1 = test_lps[0].id;
                const id_2 = test_lps[1].id;
                console.log(id_1);
                const res = await supertest(app).delete(
                    `/lost_property?id=${id_1}`
                );
                expect(res.statusCode).toBe(202);
                const res_2 = await supertest(app).delete(
                    `/lost_property?id=${id_2}`
                );
                expect(res_2.statusCode).toBe(202);
            });
        });
    });
});
