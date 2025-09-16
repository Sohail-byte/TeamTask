const sockethandling= async(io)=>{
    io.on('connection', (socket) => {
    io.emit('connected', 'connected successfully')
    let RoomId
    socket.on('join-room', (roomId) => {
        socket.join(roomId)
        io.emit('joined-room', roomId)
        RoomId = roomId
    })

    let roomLocks = {} //roomLock = { room : {socketId, userId}}


    socket.on('noteTitleInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteTitleChange', data)
    })


    socket.on('noteSummaryInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteSummaryChange', data)
    })


    socket.on('noteContentInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteContentChange', data)
    })

    socket.on('lock-request', () => {
        const room = socket.rooms
        if(!roomLocks[room] || roomLocks[room].userId === socket.id){
            roomLocks[room] = {userId: socket.id}
            socket.broadcast.to(room).emit('lock-status', {lockedBy: socket.userId})
            startLockTimer(room, socket.userId)
        }else {
            socket.emit('lock-status', { lockedBy: roomLocks[RoomId].userId });
        }

    })

    socket.on('release-lock', () => {
    const room = socket.rooms
    if (roomLocks[room] && roomLocks[room].userId === socket.userId) {
      clearTimeout(roomLocks[room].timer);
      delete roomLocks[room];
      io.to(room).emit('lock-status', { lockedBy: null });
    }
    })

    socket.on('typing', () => {
    const room = socket.room;
    if (roomLocks[room] && roomLocks[room].userId === socket.userId) {
      resetLockTimer(room, socket.userId);
    }
    })

    

})
}


function startLockTimer(RoomId, userId) {
  roomLocks[RoomId].timer = setTimeout(() => {
    if (roomLocks[RoomId]?.userId === userId) {
      delete roomLocks[RoomId];
      io.to(RoomId).emit('lock-status', { lockedBy: null });
    }
  }, 20000); // 20 seconds
}


function resetLockTimer(RoomId, userId) {
  clearTimeout(roomLocks[RoomId].timer);
  startLockTimer(RoomId, userId);
}






























export default sockethandling