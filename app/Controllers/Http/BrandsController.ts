import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BrandsService from '@ioc:Neal/BrandsService';
import PaginatorValidator from 'App/Validators/PaginatorValidator';
import {schema, rules} from "@ioc:Adonis/Core/Validator";
import Brand from "App/Models/Brand";

export default class BrandsController {
  LIMIT = 20;

  async index({request}: HttpContextContract) {
    const qs: { page?: string } = request.qs();
    await request.validate(PaginatorValidator);
    return BrandsService.list({
      limit: this.LIMIT,
      page: qs.page && parseInt(qs.page, 10) || 1
    });
  }

  async getOne({params}: HttpContextContract & { params: { id: string } }) {
    return BrandsService.getOne(parseInt(params.id, 10));
  }

  async create({request}: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.maxLength(100),
          rules.minLength(3),
          rules.unique({
            table: Brand.table,
            column: 'name',
          })
        ])
      })
    });
    const body = request.body();
    return BrandsService.create({name: body.name});
  }

  async edit({request, params}: HttpContextContract & { params: { id: string } }) {
    await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.maxLength(100),
          rules.minLength(3),
          rules.unique({
            table: Brand.table,
            column: 'name',
          })
        ])
      })
    });
    const body = request.body();
    await BrandsService.update(params.id, {name: body.name});
    return BrandsService.getOne(params.id);
  }

  async delete({params}: HttpContextContract & { params: { id: string } }) {
    await BrandsService.delete(params.id);
    return {};
  }
}
