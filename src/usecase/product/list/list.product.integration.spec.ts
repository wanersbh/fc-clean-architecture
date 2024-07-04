import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";

describe("Integration test list product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
        const productListUseCase = new ListProductUseCase(productRepository);

        const input = {
            name: "Product",
            price: 100,
        };

        const product = await productCreateUseCase.execute(input);

        const output = await productListUseCase.execute({});

        expect(output.products.length).toBe(1);
        expect(output.products[0].id).toBe(product.id);
        expect(output.products[0].name).toBe(input.name);
        expect(output.products[0].price).toBe(input.price);
    });
});