import {app, sequelize} from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1000
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.price).toBe(1000);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            name: "Product 1",
        });
        expect(response.status).toBe(400);
    });

    it("should list all product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1000
            });
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/product").send({
                name: "Product 2",
                price: 2000
            });
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product1 = listResponse.body.products[0];
        expect(product1.name).toBe("Product 1");
        expect(product1.price).toBe(1000);

        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("Product 2");
        expect(product2.price).toBe(2000);

    });

    it("should list all product in xml", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 1000
            });
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                price: 2000
            });
        expect(response2.status).toBe(200);

        const listResponseXML = await request(app).get("/product").set("Accept", "application/xml");
        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain("<products>");
        expect(listResponseXML.text).toContain("<product>");
        expect(listResponseXML.text).toContain("<id>");
        expect(listResponseXML.text).toContain("<name>");
        expect(listResponseXML.text).toContain("<price>");
    });

});