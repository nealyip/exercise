import Product from "App/Models/Product";
import {ModelPaginatorContract} from "@ioc:Adonis/Lucid/Orm";

export default class ProductsService {
  async list({page, limit}: { page: number, limit: number }
  ): Promise<ModelPaginatorContract<Product>> {
    if (limit <= 0) {
      throw new Error('limit cannot be zero');
    }
    return Product.query()
      .preload('options')
      .preload('brand')
      .preload('sport')
      .paginate(page, limit);
  }

  async getOne(id: number | string): Promise<Product> {
    return Product.query().where(Product.primaryKey, id)
      .preload('options')
      .preload('brand')
      .preload('sport')
      .firstOrFail();
  }

  async create({name, sportId, brandId}: { name: string, sportId: number, brandId: number }): Promise<Product> {
    return Product.create({name, sportId, brandId});
  }

  async update(id: number | string, {
    name,
    sportId,
    brandId
  }: { name: string, sportId: number, brandId: number }): Promise<Array<number>> {
    return Product.query().where(Product.primaryKey, id).update({name, sportId, brandId});
  }

  async delete(id: number | string): Promise<any> {
    return Product.query().where(Product.primaryKey, id).delete();
  }
}
