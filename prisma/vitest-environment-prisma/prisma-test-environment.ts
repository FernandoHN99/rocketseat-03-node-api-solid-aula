import { Environment } from 'vitest/environments'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    // Aqui foi utilizado o migrate deploy, e não o dev
    // Pois o dev ele compararia o schema com o banco de dados e somente criaria
    // as migrations necessárias, mas como estamos criando um novo schema
    // para cada ambiente de teste, não existe a necessidade de comparar, pois
    // o banco de dados está vazio.
    // Importante dizer ele é utilizado para ambientes de produção.
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
