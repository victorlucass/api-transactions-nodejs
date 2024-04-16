import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()
// register -> registrar um plugin

app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})
