import test from 'japa'
import supertest from 'supertest'
import Brand from 'App/Models/Brand'
import Database from "@ioc:Adonis/Lucid/Database";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const TEST_BRAND_NAME = 'test-brand-name';

test.group('Brand', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
    await Brand.query().delete();
    await Brand.create({
      name: TEST_BRAND_NAME
    });
  })

  test('ensure a new brand is created @success', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/brands')
      .send({name: TEST_BRAND_NAME + '_created'})
      .expect(200)
    assert.equal(body.name, TEST_BRAND_NAME + '_created')
    assert.exists(body.id)
  })

  test('ensure a name must be passed @fail', async () => {
    await supertest(BASE_URL).post('/brands')
      .send({})
      .expect(422)
  })

  test('ensure no duplicate brand names @fail', async () => {
    await supertest(BASE_URL).post('/brands')
      .send({name: TEST_BRAND_NAME})
      .expect(422)
  })

  test('ensure return listing @success', async (assert) => {
    const {body} = await supertest(BASE_URL).get('/brands').expect(200)
    assert.hasAllKeys(body.meta, [
      'total', 'per_page', 'current_page', 'last_page', 'first_page',
      'first_page_url', 'last_page_url', 'next_page_url', 'previous_page_url'
    ])
    assert.isArray(body.data)
    assert.equal(body.data[0].name, TEST_BRAND_NAME);
  })

  test('ensure return the expected brand @success', async (assert) => {
    const targetBrand = await Brand.firstOrFail()
    const {body} = await supertest(BASE_URL).get(`/brands/${targetBrand.id}`).expect(200)
    assert.equal(body.id, targetBrand.id);
    assert.equal(body.name, TEST_BRAND_NAME);
  })

  test('ensure return the expected brand @fail', async () => {
    await supertest(BASE_URL).get(`/brands/0`).expect(404)
  })

  test('ensure the brand name is editable @success', async (assert) => {
    const targetBrand = await Brand.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/brands/${targetBrand.id}`)
      .send({name: TEST_BRAND_NAME + '_updated'})
      .expect(200)
    assert.equal(body.id, targetBrand.id);
    assert.equal(body.name, TEST_BRAND_NAME + '_updated');
  })

  test('ensure the brand name is not duplicate @fail', async () => {
    const targetBrand = await Brand.firstOrFail()
    await supertest(BASE_URL).patch(`/brands/${targetBrand.id}`)
      .send({name: TEST_BRAND_NAME})
      .expect(422)
  })

  test('ensure it throws error when no name is passed @fail', async () => {
    const targetBrand = await Brand.firstOrFail()
    await supertest(BASE_URL).patch(`/brands/${targetBrand.id}`)
      .expect(422)
  })

  test('ensure the brand is deleted @success', async (assert) => {
    const targetBrand = await Brand.firstOrFail()
    await supertest(BASE_URL).delete(`/brands/${targetBrand.id}`)
      .expect(200)
    const brand = await Brand.find({
      id: targetBrand.id
    });
    assert.isNull(brand)
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
