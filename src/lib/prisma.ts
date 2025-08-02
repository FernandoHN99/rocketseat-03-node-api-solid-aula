import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

// Habilita logs em ambiente de desenvolvimento, pois o prisma executa queries
// quando faz as operações e é bom nos obervá-las
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
