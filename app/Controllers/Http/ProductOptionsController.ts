// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import ProductOptionsService from "@ioc:Neal/ProductOptionsService";
import ProductOptionValidator from "App/Validators/ProductOptionValidator";

export default class ProductOptionsController {
  async getOne({params}: HttpContextContract & { params: { id: string } }) {
    return ProductOptionsService.getOne(params.id);
  }

  async create({request}: HttpContextContract) {
    const body = request.body();
    await request.validate(ProductOptionValidator);
    return ProductOptionsService.create(body.product_id, {
      size: body.size,
      duration: body.duration,
      color: body.color
    });
  }

  async edit({request, params}: HttpContextContract & { params: { id: string } }) {
    const body = request.body();
    await request.validate(ProductOptionValidator.getEditSchema({
      size: body.size,
      color: body.color,
      original: await ProductOptionsService.getOne(params.id)
    }));
    await ProductOptionsService.update(params.id, {
      size: body.size,
      duration: body.duration,
      color: body.color
    });
    return ProductOptionsService.getOne(params.id);
  }

  async delete({params}: HttpContextContract & { params: { id: string } }) {
    await ProductOptionsService.delete(params.id);
    return {};
  }
}
