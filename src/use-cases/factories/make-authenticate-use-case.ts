import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

// Isso é pattern chamado de: Factory Pattern
// A ideia é você centralizar em uma função a criação da instância de um objeto com
// todas as suas dependências, de modo que quando a sua aplicação crescer
// e eventualmente houver várias dependências, você não precise ficar repetindo a
// mesma lógica de criação de instância em vários lugares do código.

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
