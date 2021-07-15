import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProductOption from "App/Models/ProductOption";

export default class ProductOptionSeeder extends BaseSeeder {
  // For this exercise, we enable production seeding for demonstration.
  // public static developmentOnly = true

  public async run () {
    // Write your database queries inside the run method
    await ProductOption.createMany([
      {
        productId: 1,
        size: 'S',
        color: 'Red',
        duration: 100
      },
      {
        productId: 1,
        size: 'S',
        color: 'Blue',
        duration: 100
      },
      {
        productId: 1,
        size: 'M',
        color: 'Red',
        duration: 130
      },
      {
        productId: 1,
        size: 'M',
        color: 'Blue',
        duration: 130
      },
      {
        productId: 2,
        size: 'S',
        color: 'Pink',
        duration: 365
      },
      {
        productId: 2,
        size: 'M',
        color: 'Pink',
        duration: 100
      },
      {
        productId: 3,
        size: 'L',
        color: 'Black',
        duration: 365
      },
    ]);
  }
}
