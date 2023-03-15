import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */

Ws.io.on('connection', (socket) => 
    {
        socket.emit('message', 'Servidor conectado.')

        socket.on('personas', (personas) => {
            console.log(personas)
        })
    }
)