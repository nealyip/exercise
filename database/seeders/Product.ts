import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from "App/Models/Product";

export default class ProductSeeder extends BaseSeeder {
  // For this exercise, we enable production seeding for demonstration.
  // public static developmentOnly = true

  public async run () {
    // Write your database queries inside the run method
    await Product.createMany([
      {
        name: 'BALL NEEDLE ADAPTORS TRI-PACK',
        sportId: 1,
        brandId: 1
      },
      {
        name: 'SIZE 1 MINI FOOTBALL SUNNY 300',
        sportId: 1,
        brandId: 1
      },
      {
        name: '100 PLASTIC (TRITAN) SCREW TOP HIKING FLASK 0.8 L',
        sportId: 2,
        brandId: 2
      },
      {
        name: 'COUNTRY WALKING BACKPACK - NH100 10 LITRES',
        sportId: 3,
        brandId: 3
      }
    ])
  }
}
