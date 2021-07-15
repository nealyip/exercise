import test from 'japa'
import supertest from 'supertest'
import Database from "@ioc:Adonis/Lucid/Database";
import Sport from "App/Models/Sport";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
const TEST_SPORT_NAME = 'test-sport-name';

test.group('Sport', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
    await Sport.query().delete();
    await Sport.create({
      name: TEST_SPORT_NAME
    });
  })

  test('ensure a new sport is created @success', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/sports')
      .send({name: TEST_SPORT_NAME + '_created'})
      .expect(200)
    assert.equal(body.name, TEST_SPORT_NAME + '_created')
    assert.exists(body.id)
  })

  test('ensure a name must be passed @fail', async () => {
    await supertest(BASE_URL).post('/sports')
      .send({})
      .expect(422)
  })

  test('ensure no duplicate sport names @fail', async () => {
    await supertest(BASE_URL).post('/sports')
      .send({name: TEST_SPORT_NAME})
      .expect(422)
  })

  test('ensure return listing @success', async (assert) => {
    const {body} = await supertest(BASE_URL).get('/sports').expect(200)
    assert.hasAllKeys(body.meta, [
      'total', 'per_page', 'current_page', 'last_page', 'first_page',
      'first_page_url', 'last_page_url', 'next_page_url', 'previous_page_url'
    ])
    assert.isArray(body.data)
    assert.equal(body.data[0].name, TEST_SPORT_NAME);
  })

  test('ensure return the expected sport @success', async (assert) => {
    const targetSport = await Sport.firstOrFail()
    const {body} = await supertest(BASE_URL).get(`/sports/${targetSport.id}`).expect(200)
    assert.equal(body.id, targetSport.id);
    assert.equal(body.name, TEST_SPORT_NAME);
  })

  test('ensure return the expected sport @fail', async () => {
    await supertest(BASE_URL).get(`/sports/0`).expect(404)
  })

  test('ensure the sport name is editable @success', async (assert) => {
    const targetSport = await Sport.firstOrFail()
    const {body} = await supertest(BASE_URL).patch(`/sports/${targetSport.id}`)
      .send({name: TEST_SPORT_NAME + '_updated'})
      .expect(200)
    assert.equal(body.id, targetSport.id);
    assert.equal(body.name, TEST_SPORT_NAME + '_updated');
  })

  test('ensure the sport name is not duplicate @fail', async () => {
    const targetSport = await Sport.firstOrFail()
    await supertest(BASE_URL).patch(`/sports/${targetSport.id}`)
      .send({name: TEST_SPORT_NAME})
      .expect(422)
  })

  test('ensure it throws error when no name is passed @fail', async () => {
    const targetSport = await Sport.firstOrFail()
    await supertest(BASE_URL).patch(`/sports/${targetSport.id}`)
      .expect(422)
  })

  test('ensure the sport is deleted @success', async (assert) => {
    const targetSport = await Sport.firstOrFail()
    await supertest(BASE_URL).delete(`/sports/${targetSport.id}`)
      .expect(200)
    const sport = await Sport.find({
      id: targetSport.id
    });
    assert.isNull(sport)
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
