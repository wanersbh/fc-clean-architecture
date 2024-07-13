import express, { Request, Response } from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import CustomerPresenter from "../presenters/customer.presenter";

export const customerRoute = express.Router();

customerRoute.post("/", async (req: Request, res: Response) => {
  const { name, address } = req.body;
  
  if (!name || !address) {
    res.status(400).send("Missing required fields");
    return;
  }
  
  const usecase = new CreateCustomerUseCase(new CustomerRepository());
  try {
    const customerDto = {
      name,
      address: {
        street: address.street,
        city: address.city,
        number: address.number,
        zip: address.zip,
      },
    };
    const output = await usecase.execute(customerDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

customerRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListCustomerUseCase(new CustomerRepository());
  const output = await usecase.execute({});

  res.format({
    json: async () => res.send(output),
    xml: async () => res.send(CustomerPresenter.listXML(output)),
  });
});
