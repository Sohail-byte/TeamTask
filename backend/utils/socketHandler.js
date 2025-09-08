const sockethandling= async(io)=>{
    io.on('connection', (socket) => {
    io.emit('connected', 'connected successfully')

    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        io.emit('joined-room', roomId)
    })
})

}


export default sockethandling