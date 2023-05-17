const { app } = require("./app")

const request = require("supertest")(app)

describe("healthchecks", () => {

    describe("liveness", () => {
        it("should always return 200", async () => {
            const res = await request.get("/health/liveness")
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ status: "alive" })
        });
    });

    describe("readiness", () => {
        it("should always return 200", async () => {
            const res = await request.get("/health/readiness")
            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual({ status: "ready" })
        });
    });
});
