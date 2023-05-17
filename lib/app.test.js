const { app } = require("./app")

const request = require("supertest")(app)

describe("app", () => {
    it("should return 400 if no content-type is set", async () => {
        const res = await request.post("/")
        expect(res.statusCode).toEqual(400)
    });

    describe("json", () => {
        it("should return 200 and a response for valid json mjml", async () => {
            const res = await request
                .post("/")
                .type("application/json")
                .send({
                    mjml: "<mjml><mj-body><mj-text>test</mj-text></mj-body></mjml>"
                })
            expect(res.statusCode).toEqual(200)
            expect(res.type).toEqual("application/json")
            expect(res.body.html).toBeDefined()
            expect(res.body.html).toContain("test")
        })

        it("should return 400 for invalid json mjml", async () => {
            const res = await request
                .post("/")
                .type("application/json")
                .send({
                    mjml: "this is not valid mjml"
                })
            expect(res.statusCode).toEqual(400)
            expect(res.type).toEqual("application/json")
            expect(res.body.error).toBeDefined()
            expect(res.body.error).toContain("Parsing failed. Check your mjml.")
        })
    })

    describe("text", () => {
        it("should return 200 and a response for valid mjml", async () => {
            const res = await request
                .post("/")
                .type("text/html")
                .send("<mjml><mj-body><mj-text>test</mj-text></mj-body></mjml>")
            expect(res.statusCode).toEqual(200)
            expect(res.type).toEqual("text/html")
            expect(res.text).toBeDefined()
            expect(res.text).toContain("test")
        })

        it("should return 400 for invalid mjml", async () => {
            const res = await request
                .post("/")
                .type("text/html")
                .send("this is not valid mjml")
            expect(res.statusCode).toEqual(400)
            expect(res.type).toEqual("text/html")
            expect(res.text).toBeDefined()
            expect(res.text).toContain("Parsing failed. Check your mjml.")
        })
    })

});
