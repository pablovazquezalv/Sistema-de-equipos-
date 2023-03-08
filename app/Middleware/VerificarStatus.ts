import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerificarStatus {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const usuario = await auth.authenticate()

    if(usuario.status == 0)
    {
      return response.status(403).json({ message: 'Tu cuenta está desactivada.', user: usuario })
    }

    await next()
  }
}
