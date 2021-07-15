import test from 'japa'
import supertest from 'supertest'
import Database from "@ioc:Adonis/Lucid/Database";
import Product from "App/Models/Product";
import ProductOption from "App/Models/ProductOption";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

async function createProduct(name: string): Promise<{ product: Product }> {
  return {
    product: await Product.create({
      brandId: 1,
      sportId: 1,
      name
    })
  }
}

test.group('Product Option', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
    await ProductOption.query().delete();
    const {product} = await createProduct('product-options-test');
    await ProductOption.create({
      duration: 100,
      color: 'Blue',
      size: 'M',
      productId: product.id
    });
  })

  test('ensure a new product option is created @success', async (assert) => {
    const {product} = await createProduct('product-options-test-created');
    const {body} = await supertest(BASE_URL).post('/product-options')
      .send({
        product_id: product.id,
        size: 'M',
        color: 'Red',
        duration: 100
      })
      .expect(200)
    assert.equal(body.size, 'M')
    assert.equal(body.color, 'Red')
    assert.equal(body.duration, 100)
  })

  test('ensure a product id must be passed @fail', async () => {
    await supertest(BASE_URL).post('/product-options')
      .send({size: 'M', duration: 100, color: 'Red'})
      .expect(422)
  })

  test('ensure a size must be passed @fail', async () => {
    const {product} = await createProduct('product-options-test-created');
    await supertest(BASE_URL).post('/product-options')
      .send({product_id: product.id, duration: 100, color: 'Red'})
      .expect(422)
  })

  test('ensure a color must be passed @fail', async () => {
    const {product} = await createProduct('product-options-test-created');
    await supertest(BASE_URL).post('/product-options')
      .send({product_id: product.id, duration: 100, size: 'M'})
      .expect(422)
  })

  test('ensure a duration must be passed @fail', async () => {
    const {product} = await createProduct('product-options-test-created');
    await supertest(BASE_URL).post('/product-options')
      .send({product_id: product.id, color: 'Red', size: 'M'})
      .expect(422)
  })

  test('ensure no duplicate @fail', async () => {
    const {product} = await createProduct('product-options-test-created');
    await ProductOption.create({productId: product.id, color: 'Red', size: 'M', duration: 100})

    await supertest(BASE_URL).post('/product-options')
      .send({product_id: product.id, color: 'Red', size: 'M', duration: 100})
      .expect(422)
  })


  test('ensure return the expected product @success', async (assert) => {
    const targetProductOption = await ProductOption.firstOrFail()
    const {body} = await supertest(BASE_URL).get(`/product-options/${targetProductOption.id}`).expect(200)
    assert.equal(body.size, targetProductOption.size);
    assert.equal(body.color, targetProductOption.color);
    assert.equal(body.duration, targetProductOption.duration);
  })

  test('ensure return the expected product @fail', async () => {
    await supertest(BASE_URL).get(`/product-options/0`).expect(404)
  })

  test('ensure the size is editable @success', async (assert) => {
    const targetProductOption = await ProductOption.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/product-options/${targetProductOption.id}`)
      .send({size: 'L'})
      .expect(200)
    assert.equal(body.id, targetProductOption.id);
    assert.equal(body.size, 'L');
    assert.equal(body.color, 'Blue');
  })

  test('ensure the color is editable @success', async (assert) => {
    const targetProductOption = await ProductOption.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/product-options/${targetProductOption.id}`)
      .send({color: 'Red'})
      .expect(200)
    assert.equal(body.id, targetProductOption.id);
    assert.equal(body.size, 'M');
    assert.equal(body.color, 'Red');
  })

  test('ensure the duration is editable @success', async (assert) => {
    const targetProductOption = await ProductOption.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/product-options/${targetProductOption.id}`)
      .send({duration: 400})
      .expect(200)
    assert.equal(body.id, targetProductOption.id);
    assert.equal(body.duration, 400);
    assert.equal(body.color, 'Blue');
    assert.equal(body.size, 'M');
  })

  test('ensure the size cannot be duplicate @fail', async () => {
    const targetProductOption = await ProductOption.firstOrFail()
    await ProductOption.create({
      productId: targetProductOption.productId,
      color: targetProductOption.color,
      size: 'L',
      duration: targetProductOption.duration
    })

    await supertest(BASE_URL).patch(`/product-options/${targetProductOption.id}`)
      .send({size: 'L'})
      .expect(422)
  })

  test('ensure the color cannot be duplicate @fail', async () => {
    const targetProductOption = await ProductOption.firstOrFail()
    await ProductOption.create({
      productId: targetProductOption.productId,
      color: 'Purple',
      size: targetProductOption.size,
      duration: targetProductOption.duration
    })

    await supertest(BASE_URL).patch(`/product-options/${targetProductOption.id}`)
      .send({color: 'Purple'})
      .expect(422)
  })

  test('ensure the product is deleted @success', async (assert) => {
    const targetProductOption = await ProductOption.firstOrFail()
    await supertest(BASE_URL).delete(`/product-options/${targetProductOption.id}`)
      .expect(200)
    const brand = await ProductOption.find({
      id: targetProductOption.id
    });
    assert.isNull(brand)
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
