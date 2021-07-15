import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductOptions extends BaseSchema {
  protected tableName = 'product_options'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('product_id').notNullable().unsigned()
      table.string('size', 1).notNullable()
      table.string('color', 30).notNullable()
      table.integer('duration').notNullable()

      table.unique(['product_id', 'size', 'color'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
