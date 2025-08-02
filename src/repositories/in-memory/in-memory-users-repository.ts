import { UsersRepository } from '@/repositories/users-repository'
import { User, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

//  In-Memory Repository é um padrão de projeto que simula um banco de dados em memória, ou seja,
// ele não salva os dados em disco, mas sim em memória, o que é muito útil para testes unitários,
// pois não precisamos de um banco de dados real para testar nossas funções.
// Somente é possível fazer tal implementação pois utilizamos o Repository Pattern, onde o
// repositório é uma interface, e não uma classe concreta.

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)
    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      role: 'MEMBER',
    }

    this.items.push(user)

    return user
  }
}
