import ProductOption from "App/Models/ProductOption";

export default class ProductOptionsService {
  async getOne(id: number | string): Promise<ProductOption> {
    return ProductOption.query().where(ProductOption.primaryKey, id)
      .firstOrFail();
  }

  async create(
    productId: number | string,
    {
      size, color, duration
    }: { size: ProductOption['size'], color: string, duration: number }): Promise<ProductOption> {
    return ProductOption.create({
      size, color, duration, productId: typeof productId === 'string' ? parseInt(productId, 10) : productId
    });
  }

  async update(id: number | string, {
    size,
    color,
    duration
  }: { size: ProductOption['size'], color: string, duration: number }): Promise<Array<number>> {
    return ProductOption.query().where(ProductOption.primaryKey, id).update({size, color, duration});
  }

  async delete(id: number | string): Promise<any> {
    return ProductOption.query().where(ProductOption.primaryKey, id).delete();
  }
}
