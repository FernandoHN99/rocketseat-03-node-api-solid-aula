import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Prisma } from '@prisma/client'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -27.209205,
      longitude: -49.6401091,
    })

    vi.useFakeTimers() // Encapsula todas as chamadas subsequentes aos timers até que ⁠vi.useRealTimers() seja chamado.
  })

  afterEach(() => {
    vi.useRealTimers() // Restaura o comportamento padrão dos timers.
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // O intuito do vi.useFakeTimers() vi.setSystemTime e vi.useFakeTimers é de setar a data e hora (neste caso) do sistema
  // para um valor específico nos testes em questão.
  // Muitas vezes quando se tem regras de negócio que dependem de datas, podemos ter problemas
  // se implementarmos com a data atual simplesmente (new Date()). Porque a data atual evidentemente irá mudar no futuro, e por algum motivo
  // o teste poderá falhar em virtude disso.
  // Imagine que os testes rodem antes do deploy e eles sejam cruciais para garantir que a aplicação
  // "suba" de forma automática, assim podem causar dor de cabeça no deploy, por um detalhe bobo.
  // Importante dizer que neste caso de uso em específico, seria pouco provável que o teste falhasse, mas é um exemplo de usar os métodos do vi.
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Prisma.Decimal(-27.0747279),
      longitude: new Prisma.Decimal(-49.4889672),
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
