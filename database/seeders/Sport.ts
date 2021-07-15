import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Sport from "App/Models/Sport";

export default class SportSeeder extends BaseSeeder {
  // For this exercise, we enable production seeding for demonstration.
  // public static developmentOnly = true

  public async run () {
    // Write your database queries inside the run method
    await Sport.createMany([
      {
        name: 'Football'
      },
      {
        name: 'Hiking'
      },
      {
        name: 'Tennis'
      }
    ])
  }
}
