import { CheckIn, Prisma } from '@prisma/client'

// Para toda entidade gerada no prima, é criada uma tipagem com nome: <nomeEntidade>UnckeckedCreateInput
// que nada mais é do que um tipo que estabelece que todos os campos opcionais da entidade já foram
// criados. Ela se torna muito útil em entidades que possuem relacionamentos, pois ela supõem
// que as entidade relacionadas já foram criadas e que os ids delas já estão disponíveis.
// Caso os relacionamento não existam, o prisma disponibiliza a tipagem padrão <nomeEntidade>CreateInput.

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  countByUserId(userId: string): Promise<number>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  save(checkIn: CheckIn): Promise<CheckIn>
}
