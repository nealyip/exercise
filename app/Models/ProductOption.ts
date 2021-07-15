import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Product from "App/Models/Product";

export default class ProductOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number;

  @belongsTo(() => Product, {
    foreignKey: 'productId'
  })
  public product: BelongsTo<typeof Product>

  @column()
  public size: 'M' | 'S' | 'L'

  @column()
  public color: string

  @column()
  public duration: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
