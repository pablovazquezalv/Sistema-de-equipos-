/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

//probar
import Route from '@ioc:Adonis/Core/Route'
Route.get('/', async () => {
  return { hello: 'Mexico' }
})

//Usuarios--Logeo y registro
Route.group(() => {
  Route.post('/register', 'UsersController.register').as('register')
  Route.post('/login', 'UsersController.login').as('login').middleware('status_correo')
  Route.post('/logout', 'UsersController.logout').as('logout').middleware('auth')
})

Route.group(() => {
Route.get('/user/:id', 'UsersController.mostrarUsuario').as('mostrarUsuario').middleware('rol:1')
})

//Auth
Route.group(() => {
  Route.get('/enviarCodigo/:id', 'AuthController.enviarCodigo').as('enviarCodigo')
  Route.get('/auth/reenviarCodigo/:id', 'AuthController.reenviarCodigo').as('reenviarCodigo')

  Route.post('/verificarCodigo/:id', 'AuthController.verificarCodigo').as('verificarCodigo')

  Route.post('/auth/verificarToken', 'AuthController.verificarToken').as('verificarToken')
})

//Funciones administrativas
Route.group(() => {
  Route.get('/admin/', 'UsersController.mostrarUsuarios').as('admin.mostrarUsuarios')
  Route.put('/admin/rol/:id', 'UsersController.cambiarRol').as('admin.cambiarRol')
  Route.put('/admin/status/:id', 'UsersController.cambiarStatus').as('admin.cambiarStatus')
  Route.delete('/admin/:id', 'UsersController.eliminarUsuario').as('admin.eliminarUsuario')
}).middleware(['auth', 'status'])

//Funciones de usuario y administrador
//Partidos
Route.group(() => {
  Route.get('/', 'PartidosController.mostrar').middleware('rol:1,2,3')
  Route.post('/', 'PartidosController.agregar').middleware('rol:1,2,3')
  Route.put('/:id', 'PartidosController.editar').middleware('rol:1,2,3')
  Route.delete('/:id', 'PartidosController.eliminar').middleware('rol:1,2')
  Route.get('/:id', 'PartidosController.mostrarUnico').middleware('rol:1,2')
})
.prefix('/partidos').middleware(['auth', 'status'])

//Jugadores
Route.group(() => {
  Route.get('/', 'JugadoresController.mostrar').middleware('rol:1,2,3')
  Route.post('/', 'JugadoresController.agregar').middleware('rol:1,2,3')
  Route.put('/:id', 'JugadoresController.editar').middleware('rol:1,2')
  Route.delete('/:id', 'JugadoresController.eliminar').middleware('rol:1,2')
  Route.get('/:id', 'JugadoresController.mostrarUnico').middleware('rol:1,2')
})
.prefix('/jugadores').middleware(['auth', 'status'])

//Equipos
Route.group(() => {
Route.get('/', 'EquiposController.mostrar').middleware('rol:1,2,3')
Route.post('/', 'EquiposController.agregar').middleware('rol:1,2,3')
Route.put('/:id', 'EquiposController.editar').middleware('rol:1,2')
Route.delete('/:id', 'EquiposController.eliminar').middleware('rol:1,2')
Route.get('/:id', 'EquiposController.mostrarUnico').middleware('rol:1,2')
Route.get('/equipo/:id', 'EquiposController.mostrarJugadoresCiertoEquipo').middleware('rol:1,2,3')
Route.put('/jugadores/:id', 'EquiposController.cambiarEquipoJugadores').middleware('rol:1,2')
})
.prefix('/equipos').middleware(['auth', 'status'])

//Propietarios
Route.group(() => {
  Route.get('/', 'PropietariosController.mostrar').middleware('rol:1,2,3')
  Route.post('/', 'PropietariosController.agregar').middleware('rol:1,2,3')
  Route.put('/:id', 'PropietariosController.editar').middleware('rol:1,2')
  Route.delete('/:id', 'PropietariosController.eliminar').middleware('rol:1,2')
  Route.get('/:id', 'PropietariosController.mostrarUnico').middleware('rol:1,2')
})
.prefix('/propietarios').middleware(['auth', 'status'])

//Estados
Route.group(() => {
    Route.get('/', 'EstadosController.mostrar').middleware('rol:1,2,3')
    Route.post('/', 'EstadosController.agregar').middleware('rol:1,2,3')
    Route.put('/:id', 'EstadosController.editar').middleware('rol:1,2')
    Route.delete('/:id', 'EstadosController.eliminar').middleware('rol:1,2')
    Route.get('/:id', 'EstadosController.mostrarUnico').middleware('rol:1,2')
  })
.prefix('/estados').middleware(['auth', 'status'])



//Personas - Web Socket
Route.group(() => {
  Route.get('/', 'PersonasController.mostrar')
  Route.post('/', 'PersonasController.agregar')
  Route.put('/:id', 'PersonasController.editar')
  Route.delete('/:id', 'PersonasController.eliminar')
  Route.get('/:id', 'PersonasController.mostrarUnico')
}).prefix('/personas')

Route.get('/eventos', 'PersonasController.eventos')