import {rules, schema} from '@ioc:Adonis/Core/Validator'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Product from "App/Models/Product";
import ProductOption from "App/Models/ProductOption";

export default class ProductOptionValidator {
  constructor(protected ctx: HttpContextContract) {
  }

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


  public refs = schema.refs({
    size: this.ctx.request.body().size || '',
    productId: this.ctx.request.body().product_id || '',
    duration: this.ctx.request.body().duration || '',
    color: this.ctx.request.body().color || ''
  })

  public schema = schema.create({
    product_id: schema.number([
      rules.exists({
        table: Product.table,
        column: Product.primaryKey
      })
    ]),
    size: schema.enum(['M', 'L', 'S'], [
      rules.unique({
        table: ProductOption.table,
        column: 'size',
        where: {
          product_id: this.refs.productId,
          color: this.refs.color,
        }
      })
    ]),
    color: schema.string({}, [
      rules.minLength(1),
      rules.maxLength(30)
    ]),
    duration: schema.number([
      rules.range(0, 10000000)
    ])
  })

  static getEditSchema(
    {size, color, original}: { size: ProductOption['size'], color: string, original: ProductOption }) {
    return {
      schema: schema.create({
        size: schema.enum.optional(['M', 'L', 'S'], [
          rules.unique({
            table: ProductOption.table,
            column: 'size',
            where: {
              product_id: original.productId,
              color: color || original.color,
            }
          })
        ]),
        color: schema.string.optional({}, [
          rules.minLength(1),
          rules.maxLength(30),
          rules.unique({
            table: ProductOption.table,
            column: 'color',
            where: {
              product_id: original.productId,
              size: size || original.size,
            }
          })
        ]),
        duration: schema.number.optional([
          rules.range(0, 10000000)
        ])
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
