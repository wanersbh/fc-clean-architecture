import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test update product use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const input = {
            name: "Product",
            price: 100,
        };

        const product = await productCreateUseCase.execute(input);

        const updateInput = {
            id: product.id,
            name: "Product Updated",
            price: 200,
        };

        const output = await productUpdateUseCase.execute(updateInput);

        expect(output).toEqual(updateInput);
    });
});