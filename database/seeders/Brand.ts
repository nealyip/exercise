import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Brand from "App/Models/Brand";

export default class BrandSeeder extends BaseSeeder {
  // For this exercise, we enable production seeding for demonstration.
  // public static developmentOnly = true

  public async run () {
    // Write your database queries inside the run method
    await Brand.createMany([
      {
        name: 'Kipsta'
      },
      {
        name: 'Quechua'
      },
      {
        name: 'Artengo'
      }
    ])
  }
}
