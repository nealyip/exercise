// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import PaginatorValidator from "App/Validators/PaginatorValidator";
import SportsService from "@ioc:Neal/SportsService";
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Sport from "App/Models/Sport";

export default class SportsController {
  LIMIT = 20;

  async index({request}: HttpContextContract) {
    const qs: { page?: string } = request.qs();
    await request.validate(PaginatorValidator);
    return SportsService.list({
      limit: this.LIMIT,
      page: qs.page && parseInt(qs.page, 10) || 1
    });
  }

  async getOne({params}: HttpContextContract & { params: { id: string } }) {
    return SportsService.getOne(params.id);
  }

  async create({request}: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.maxLength(100),
          rules.minLength(3),
          rules.unique({
            table: Sport.table,
            column: 'name',
          })
        ])
      })
    });
    const body = request.body();
    return SportsService.create({name: body.name});
  }

  async edit({request, params}: HttpContextContract & { params: { id: string } }) {
    await request.validate({
      schema: schema.create({
        name: schema.string({}, [
          rules.maxLength(100),
          rules.minLength(3),
          rules.unique({
            table: Sport.table,
            column: 'name',
          })
        ])
      })
    });
    const body = request.body();
    await SportsService.update(params.id, {name: body.name});
    return SportsService.getOne(params.id);
  }

  async delete({params}: HttpContextContract & { params: { id: string } }) {
    await SportsService.delete(params.id);
    return {};
  }
}
