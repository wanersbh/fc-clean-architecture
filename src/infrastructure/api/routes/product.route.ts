import express, { Request, Response} from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductPresenter from "../presenters/product.presenter";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const { name, price } = req.body;

    if(!name || !price) {
        res.status(400).send("Missing required fields");
        return;
    }
    
    const usecase = new CreateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            name,
            price
        };
        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository());
    const output = await usecase.execute({});

    res.format({
        json: async () => res.send(output),
        xml: async () => res.send(ProductPresenter.listXML(output)),
    });
});
