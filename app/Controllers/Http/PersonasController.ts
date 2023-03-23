import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Persona from 'App/Models/Persona';
import Ws from 'App/Services/Ws';

export default class PersonasController {
    public async agregar({ request, response }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_paterno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_materno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            f_nac: schema.date({
                format: 'yyyy-mm-dd',
            },
            [
                rules.required(),
            ]),
            sexo: schema.string([
                rules.required(),
                rules.sexo(),
            ]),
        })

        try
        {
            const data = await request.validate(
                {
                    schema: validationSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',

                        'ap_paterno.required': 'El apellido paterno es requerido',
                        'ap_paterno.minLength': 'El apellido paterno debe tener al menos 3 caracteres',
                        'ap_paterno.maxLength': 'El apellido paterno debe tener como máximo 20 caracteres',
                        'ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',

                        'ap_materno.required': 'El apellido materno es requerido',
                        'ap_materno.minLength': 'El apellido materno debe tener al menos 3 caracteres',
                        'ap_materno.maxLength': 'El apellido materno debe tener como máximo 20 caracteres',
                        'ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',

                        'f_nac.required': 'La fecha de nacimiento es requerida',
                        'f_nac.date': 'La fecha de nacimiento debe ser una fecha',

                        'sexo.required': 'El sexo es requerido',
                        'sexo.string': 'El sexo debe ser una cadena de caracteres',
                        'sexo.sexo': 'El sexo debe ser M o F',
                    },
                }
            );

            const { nombre, ap_paterno, ap_materno, f_nac,sexo } = data;

            const persona = new Persona();
            persona.nombre = nombre;
            persona.ap_paterno = ap_paterno;
            persona.ap_materno = ap_materno;
            persona.f_nac = f_nac;
            persona.sexo = sexo;
            await persona.save();
          
            Ws.io.emit('new:persona', persona);
            return response.status(201).json({ data: persona });
        }

        catch(error) 
        {
            response.badRequest({ message: error.messages });
        }
    }
      
    public async editar({ request, response,params }: HttpContextContract) 
    {
        const validationSchema = schema.create
        ({
            nombre: schema.string([
                rules.minLength(3),
                rules.maxLength(20),
            ]),
              ap_paterno: schema.string([
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            ap_materno: schema.string( [
                rules.required(),
                rules.minLength(3),
                rules.maxLength(20),
            ]),
            f_nac: schema.date({
                format: 'yyyy-mm-dd',
            },
            [
                rules.required(),
            ]),
            sexo: schema.string([
                rules.sexo(),
            ]),
        })
      
        try 
        {
            const data = await request.validate(
                {
                    schema: validationSchema,
                    messages: {
                        'nombre.required': 'El nombre es requerido',
                        'nombre.string': 'El nombre debe ser una cadena de caracteres',
                        'nombre.minLength': 'El nombre debe tener al menos 3 caracteres',
                        'nombre.maxLength': 'El nombre debe tener como máximo 20 caracteres',

                        'ap_paterno.required': 'El apellido paterno es requerido',
                        'ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',
                        'ap_paterno.minLength': 'El apellido paterno debe tener al menos 3 caracteres',
                        'ap_paterno.maxLength': 'El apellido paterno debe tener como máximo 20 caracteres',

                        'ap_materno.required': 'El apellido materno es requerido',
                        'ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',
                        'ap_materno.minLength': 'El apellido materno debe tener al menos 3 caracteres',
                        'ap_materno.maxLength': 'El apellido materno debe tener como máximo 20 caracteres',

                        'sexo.required': 'El sexo es requerido',
                        'sexo.string': 'El sexo debe ser una cadena de caracteres',
                        'sexo.sexo': 'El sexo debe ser M o F',

                        'f_nac.required': 'La fecha de nacimiento es requerida',
                        'f_nac.date': 'La fecha de nacimiento debe ser una fecha válida',
                    },
                }
            );

            const persona = await Persona.findOrFail(params.id);

            if (persona) 
            { 
                persona.nombre = data.nombre;
                persona.ap_paterno = data.ap_paterno;
                persona.ap_materno = data.ap_materno;
                persona.f_nac = data.f_nac;
                persona.sexo = data.sexo;
                await persona.save();

                Ws.io.emit('new:persona', persona);
                return response.ok({ data: persona });
            }
  
            return response.notFound({ message: 'La persona no existe.' });
        }

        catch (error) 
        {  
            response.badRequest({ message: error.messages });
        }
    }
      
    public async eliminar({params,response}:HttpContextContract)
    {
        const persona = await Persona.find(params.id);

        if(persona)
        {        
            await persona.delete()
            Ws.io.emit('new:persona', persona);
            return response.ok({ message:"La persona se eliminó correctamente." });
        }
        return response.notFound({ message:"La persona no existe." });
        
    }

    public async mostrar({response}:HttpContextContract)
    {
        const personas = await Persona.query().orderBy('id', 'asc');

        if(personas)
        {
            return personas
        }

        else
        {
            return response.notFound({ message: 'No hay personas registradas.' });
        }
    }

    public async mostrarUnico({params,response}: HttpContextContract)
    {
        const persona = await Persona.find(params.id);

        if(persona)
        {
            return persona
        }

        else
        {
            return response.notFound({ message: 'La persona no existe.' });
        }
    }

    public async eventos({response}:HttpContextContract)
    {
        response.header('Content-Type', 'text/event-stream');
        response.header('Cache-Control', 'no-cache');
        response.header('Connection', 'keep-alive');

        //const personas = await Persona.query().orderBy('id', 'asc');
        //response.send(`event: notice\ndata: ${JSON.stringify(personas)}\n\n`);
        
        response.send('event: notice\ndata: Se han actualizado los datos')
    }
}
