import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'
// Essa classe também conhecida como Service, é importante ela não estar acoplada a nenhuma camada, pois se houver qualquer mudança em uma na interface com o banco de dados, por exemplo se mudarmos o prisma por outro ORM, não precisaremos mudar nada nessa classe.
// Assim dessa forma não instanciamos nenhuma repository diretamente aqui e sim na controller, onde passamos a instância como parâmetro.

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
    return { user }
  }
}
