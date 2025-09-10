const sockethandling= async(io)=>{
    io.on('connection', (socket) => {
    io.emit('connected', 'connected successfully')
    let RoomId
    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        io.emit('joined-room', roomId)
        RoomId = roomId
    })


    socket.on('noteTitleInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteTitleChange', data)
    })


    socket.on('noteSummaryInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteSummaryChange', data)
    })


    socket.on('noteContentInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteContentChange', data)
    })




})
}


































export default sockethandling