import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import { ZodError } from 'zod'
import { env } from '@/env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  // expiresIn é o tempo de expiração do token, assim quando o token de autenticação é emitido dentro dele é salvo a data de emissão
  // e portanto quando o backend for acessado novamente, ele verifica se o token está dentro do tempo de expiração no caso 10 minutos
  sign: {
    expiresIn: '10m',
  },
})
// Adiciona plugin para manipular cookies
// OBS: para integrar com um frontend é necessário adicionar também o cors, neste caso não foi adicionado, pois não temos um frontend
app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

// o _ ou _<nomeVariavel> é utilizado quando um parâmetro é recebido mas não é utilizado
// Neste caso, o segundo parâmetro é o request, pode ser tanto _ quanto _request
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Deveriavmos conectar com algumas das ferramentas como DataDog/NewRelic/Sentry
    // para logar os erros e monitorar a aplicação
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
