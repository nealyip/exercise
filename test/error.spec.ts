import test from 'japa'
import supertest from 'supertest'
import Database from "@ioc:Adonis/Lucid/Database";

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  test('ensure home page returns 404 @fail', async () => {
    await supertest(BASE_URL).get('/').expect(404)
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
