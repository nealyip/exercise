import Brand from "App/Models/Brand";
import {ModelPaginatorContract} from "@ioc:Adonis/Lucid/Orm";

export default class BrandsService {
  async list({page, limit}: { page: number, limit: number }
  ): Promise<ModelPaginatorContract<Brand>> {
    if (limit <= 0) {
      throw new Error('limit cannot be zero');
    }
    return Brand.query().paginate(page, limit);
  }

  async getOne(id: number | string): Promise<Brand> {
    return Brand.findOrFail(id);
  }

  async create({name}: { name: string }): Promise<Brand> {
    return Brand.create({name});
  }

  async update(id: number | string, {name}: { name: string }): Promise<Array<number>> {
    return Brand.query().where(Brand.primaryKey, id).update({name: name});
  }

  async delete(id: number | string): Promise<any> {
    return Brand.query().where(Brand.primaryKey, id).delete();
  }
}
