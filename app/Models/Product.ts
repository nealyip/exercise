import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import Brand from "App/Models/Brand";
import Sport from "App/Models/Sport";
import ProductOption from "App/Models/ProductOption";

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public brandId: number;

  @belongsTo(() => Brand, {
    localKey: 'id',
    foreignKey: 'brandId',
  })
  public brand: BelongsTo<typeof Brand>

  @column()
  public sportId: number;

  @belongsTo(() => Sport, {
    localKey: 'id',
    foreignKey: 'sportId',
  })
  public sport: BelongsTo<typeof Sport>

  @hasMany(() => ProductOption, {
    foreignKey: 'productId'
  })
  public options: HasMany<typeof ProductOption>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
