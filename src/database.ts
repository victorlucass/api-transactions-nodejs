import 'dotenv/config'
// importando o dotenv/config para carregar as variaveis de ambiente, no caso 'process.env'
import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT, // qual o banco?
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? {
          filename: env.DATABASE_URL, // No caso do SQLite3, o nome do arquivo
        }
      : env.DATABASE_URL,
  useNullAsDefault: true, // usar o null como valor padrao
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
