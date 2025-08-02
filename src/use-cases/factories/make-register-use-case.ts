import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

// Isso é pattern chamado de: Factory Pattern
// A ideia é você centralizar em uma função a criação da instância de um objeto com
// todas as suas dependências, de modo que quando a sua aplicação crescer
// e eventualmente houver várias dependências, você não precise ficar repetindo a
// mesma lógica de criação de instância em vários lugares do código.

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)
  return registerUseCase
}
