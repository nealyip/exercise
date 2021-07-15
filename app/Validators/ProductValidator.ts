import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Product from "App/Models/Product";
import Brand from "App/Models/Brand";
import Sport from "App/Models/Sport";

export default class ProductValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public refs = schema.refs({
    brandId: this.ctx.request.body().brand_id || '',
    sportId: this.ctx.request.body().sport_id || '',
  })
  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(255),
      rules.minLength(3),
      rules.unique({
        table: Product.table,
        column: 'name',
        where: {
          brand_id: this.refs.brandId,
          sport_id: this.refs.sportId
        }
      })
    ]),
    brand_id: schema.number([
      rules.exists({
        table: Brand.table,
        column: Brand.primaryKey
      }),
    ]),
    sport_id: schema.number([
      rules.exists({
        table: Sport.table,
        column: Sport.primaryKey
      })
    ]),
  })


  static getEditSchema(
    {name, brandId, sportId, original}: { name: string, brandId: number, sportId: number, original: Product }) {
    return {
      schema: schema.create({
        name: schema.string.optional({}, [
          rules.maxLength(255),
          rules.minLength(3),
          rules.unique({
            table: Product.table,
            column: 'name',
            where: {
              brand_id: brandId || original.brandId,
              sport_id: sportId || original.sportId
            }
          })
        ]),
        brand_id: schema.number.optional([
          rules.exists({
            table: Brand.table,
            column: Brand.primaryKey
          }),
          rules.unique({
            table: Product.table,
            column: 'brand_id',
            where: {
              name: name || original.name,
              sport_id: sportId || original.sportId
            }
          })
        ]),
        sport_id: schema.number.optional([
          rules.exists({
            table: Sport.table,
            column: Sport.primaryKey
          }),
          rules.unique({
            table: Product.table,
            column: 'sport_id',
            where: {
              name: name || original.name,
              brand_id: brandId || original.brandId
            }
          })
        ]),
      })
    }
  }

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
