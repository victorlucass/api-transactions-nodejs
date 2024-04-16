import { test, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import req from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('Transactions router', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    // execSync -> executa um comando dentro do terminal
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  }) // Vai executar antes de cada teste

  test('should be able to create a new transaction', async () => {
    await req(app.server)
      .post('/transactions')
      .send({
        title: 'transaction teste',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  test('should be able to list all transactions', async () => {
    const newTransaction = await req(app.server).post('/transactions').send({
      title: 'transaction teste',
      amount: 5000,
      type: 'credit',
    })

    const cookie = newTransaction.get('Set-Cookie')

    const listTransactions = await req(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'transaction teste',
        amount: 5000,
      }),
    ])
  })

  test('should be able to get a specific transaction', async () => {
    const newTransaction = await req(app.server).post('/transactions').send({
      title: 'transaction teste',
      amount: 5000,
      type: 'credit',
    })

    const cookie = newTransaction.get('Set-Cookie')

    const listTransactions = await req(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    const transactionId = listTransactions.body.transactions[0].id

    const transaction = await req(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(transaction.body.transaction).toEqual(
      expect.objectContaining({
        title: 'transaction teste',
        amount: 5000,
      }),
    )
  })

  test('should be able to get the summary', async () => {
    const transactionCreatedResponse = await req(app.server)
      .post('/transactions')
      .send({
        title: 'credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookie = transactionCreatedResponse.get('Set-Cookie')

    await req(app.server).post('/transactions').set('Cookie', cookie).send({
      title: 'debit transaction',
      amount: 2000,
      type: 'debit',
    })

    const summaryTransaction = await req(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
      .expect(200)

    console.log(summaryTransaction.body.summary)

    expect(summaryTransaction.body.summary).toEqual({
      amount: 3000,
    })
  })
})
