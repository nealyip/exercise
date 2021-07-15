import test from 'japa'
import supertest from 'supertest'
import Database from "@ioc:Adonis/Lucid/Database";
import Product from "App/Models/Product";
import Brand from "App/Models/Brand";
import Sport from "App/Models/Sport";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const TEST_PRODUCT_NAME = 'test-product-name';

async function createBrandSport(brandName, sportName): Promise<{brand: Brand, sport: Sport}>{
  const brand = await Brand.create({
    name: brandName
  });
  const sport = await Sport.create({
    name: sportName
  });
  return {brand, sport};
}

test.group('Product', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
    await Product.query().delete();
    await Brand.query().delete();
    await Sport.query().delete();
    const {brand, sport} = await createBrandSport('Random', 'Random')
    await Product.create({
      name: TEST_PRODUCT_NAME,
      brandId: brand.id,
      sportId: sport.id
    });
  })

  test('ensure a new product is created @success', async (assert) => {
    const {brand, sport} = await createBrandSport('Random Created', 'Random Created')
    const {body} = await supertest(BASE_URL).post('/products')
      .send({
        name: TEST_PRODUCT_NAME + '_created',
        brand_id: brand.id,
        sport_id: sport.id
      })
      .expect(200)
    assert.equal(body.name, TEST_PRODUCT_NAME + '_created')
    assert.exists(body.id)
  })

  test('ensure a name must be passed @fail', async () => {
    const {brand, sport} = await createBrandSport('Random Created', 'Random Created')
    await supertest(BASE_URL).post('/products')
      .send({brand_id: brand.id, sport_id: sport.id})
      .expect(422)
  })

  test('ensure a brand id must be passed @fail', async () => {
    const {sport} = await createBrandSport('Random Created', 'Random Created')
    await supertest(BASE_URL).post('/products')
      .send({name: TEST_PRODUCT_NAME + '_created', sport_id: sport.id})
      .expect(422)
  })

  test('ensure a sport id must be passed @fail', async () => {
    const {brand} = await createBrandSport('Random Created', 'Random Created')
    await supertest(BASE_URL).post('/products')
      .send({name: TEST_PRODUCT_NAME + '_created', brand_id: brand.id})
      .expect(422)
  })

  test('ensure no duplicate product names @fail', async () => {
    await supertest(BASE_URL).post('/products')
      .send({name: TEST_PRODUCT_NAME})
      .expect(422)
  })

  test('ensure return listing @success', async (assert) => {
    const {body} = await supertest(BASE_URL).get('/products').expect(200)
    assert.hasAllKeys(body.meta, [
      'total', 'per_page', 'current_page', 'last_page', 'first_page',
      'first_page_url', 'last_page_url', 'next_page_url', 'previous_page_url'
    ])
    assert.isArray(body.data)
    assert.equal(body.data[0].name, TEST_PRODUCT_NAME);
  })

  test('ensure return the expected product @success', async (assert) => {
    const targetProduct = await Product.firstOrFail()
    const {body} = await supertest(BASE_URL).get(`/products/${targetProduct.id}`).expect(200)
    assert.equal(body.id, targetProduct.id);
    assert.equal(body.name, TEST_PRODUCT_NAME);
  })

  test('ensure return the expected product @fail', async () => {
    await supertest(BASE_URL).get(`/products/0`).expect(404)
  })

  test('ensure the product name is editable @success', async (assert) => {
    const targetProduct = await Product.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/products/${targetProduct.id}`)
      .send({name: TEST_PRODUCT_NAME + '_updated'})
      .expect(200)
    assert.equal(body.id, targetProduct.id);
    assert.equal(body.name, TEST_PRODUCT_NAME + '_updated');
  })

  test('ensure the product name is not duplicate @fail', async () => {
    const targetProduct = await Product.firstOrFail()
    await supertest(BASE_URL).patch(`/products/${targetProduct.id}`)
      .send({name: TEST_PRODUCT_NAME})
      .expect(422)
  })

  test('ensure the product is deleted @success', async (assert) => {
    const targetProduct = await Product.firstOrFail()
    await supertest(BASE_URL).delete(`/products/${targetProduct.id}`)
      .expect(200)
    const brand = await Product.find({
      id: targetProduct.id
    });
    assert.isNull(brand)
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
