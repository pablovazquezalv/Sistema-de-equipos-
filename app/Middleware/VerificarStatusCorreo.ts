import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class VerificarStatusCorreo {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const usuario = await User.findBy('email', request.input('email'))

    if(usuario?.status == 0)
    {
      return response.status(403).json({ message: 'Tu cuenta está desactivada.', user: usuario })
    }

    await next()
  }
}
