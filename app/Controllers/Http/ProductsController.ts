import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import PaginatorValidator from "App/Validators/PaginatorValidator";
import ProductsService from "@ioc:Neal/ProductsService";
import ProductValidator from "App/Validators/ProductValidator";

export default class ProductsController {
  LIMIT = 20;

  async index({request}: HttpContextContract) {
    const qs: { page?: string } = request.qs();
    await request.validate(PaginatorValidator);
    return ProductsService.list({
      limit: this.LIMIT,
      page: qs.page && parseInt(qs.page, 10) || 1
    });
  }

  async getOne({params}: HttpContextContract & { params: { id: string } }) {
    return ProductsService.getOne(params.id);
  }

  async create({request}: HttpContextContract) {
    const body = request.body();
    await request.validate(ProductValidator);
    return ProductsService.create({name: body.name, brandId: body.brand_id, sportId: body.sport_id});
  }

  async edit({request, params}: HttpContextContract & { params: { id: string } }) {
    const body = request.body();
    await request.validate(ProductValidator.getEditSchema({
      name: body.name,
      brandId: body.brand_id,
      sportId: body.sport_id,
      original: await ProductsService.getOne(params.id)
    }));
    await ProductsService.update(params.id, {
      name: body.name,
      brandId: body.brand_id,
      sportId: body.sport_id
    });
    return ProductsService.getOne(params.id);
  }

  async delete({params}: HttpContextContract & { params: { id: string } }) {
    await ProductsService.delete(params.id);
    return {};
  }
}
