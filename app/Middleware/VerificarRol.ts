import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerificarRol {
  public async handle({ auth, response}: HttpContextContract, next: () => Promise<void>, roles: String[]) {
    const usuario = await auth.authenticate()

    if (!roles.includes(usuario.role.toString()))
    {
      return response.status(403).json({ message: 'No tienes permiso para realizar esta acción.', user: usuario , roles: roles})
    }

    await next()
  }
}
