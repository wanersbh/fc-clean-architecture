import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "./find.product.usecase";

describe("Integration test find product use case", () => {
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

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const productCreateUseCase = new CreateProductUseCase(productRepository);
        const productFindUseCase = new FindProductUseCase(productRepository);

        const input = {
            name: "Product",
            price: 100,
        };

        const product = await productCreateUseCase.execute(input);

        const output = await productFindUseCase.execute({ id: product.id });

        expect(output).toEqual({
            id: product.id,
            name: input.name,
            price: input.price,
        });
    });

    it("should thrown an error when id is missing", async () => {
        const productRepository = new ProductRepository();
        const productFindUseCase = new FindProductUseCase(productRepository);

        await expect(productFindUseCase.execute({ id: "" })).rejects.toThrow(
            "Id is required"
        );
    });

    it("should thrown an error when product is not found", async () => {
        const productRepository = new ProductRepository();
        const productFindUseCase = new FindProductUseCase(productRepository);

        await expect(productFindUseCase.execute({ id: "1" })).rejects.toThrow(
            "Product not found"
        );
    });
});