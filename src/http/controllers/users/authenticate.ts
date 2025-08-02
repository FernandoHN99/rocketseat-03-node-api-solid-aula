import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    // chama a respectiva factory para criar a instância do use case em questão
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // Gera um token JWT para o usuário autenticado
    // Primeiro argumento é onde vc pode passar informações adicionais
    // Segundo argumento é onde vc pode passar informações para o payload do token (sub, exp, etc)
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // Rotas onde o cookie é válido, neste caso todas
        // secure: true, // O cookie é encriptado pelo protocolo HTTPS, quando houver (ESSE ESTÁ QUEBRANDO!)
        sameSite: true, // O cookie só é enviado para o mesmo site/domínio
        httpOnly: true, // O cookie só pode ser acessado pelo servidor, via requisições, portanto no navegador do cliente ele não aparecerá em nenhuma aba
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
