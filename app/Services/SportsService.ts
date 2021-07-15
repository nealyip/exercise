import Sport from "App/Models/Sport";
import {ModelPaginatorContract} from "@ioc:Adonis/Lucid/Orm";

export default class SportsService {
  async list({page, limit}: { page: number, limit: number }
  ): Promise<ModelPaginatorContract<Sport>> {
    if (limit <= 0) {
      throw new Error('limit cannot be zero');
    }
    return Sport.query().paginate(page, limit);
  }

  async getOne(id: number | string): Promise<Sport> {
    return Sport.findOrFail(id);
  }

  async create({name}: { name: string }): Promise<Sport> {
    return Sport.create({name});
  }

  async update(id: number | string, {name}: { name: string }): Promise<Array<number>> {
    return Sport.query().where(Sport.primaryKey, id).update({name: name});
  }

  async delete(id: number | string): Promise<any> {
    return Sport.query().where(Sport.primaryKey, id).delete();
  }
}
