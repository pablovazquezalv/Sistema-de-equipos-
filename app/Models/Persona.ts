import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Persona extends BaseModel {
  //Datos de la tabla
  @column({ isPrimary: true })
  public id: number

  @column()
  public nombre: string

  @column()
  public ap_paterno: string
  
  
  @column()
  public ap_materno: string
  
  @column()
  public sexo: string

  @column.date()
  public f_nac: DateTime

  //Extra
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
