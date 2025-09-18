let roomLocks = {}; // { roomId: { userId, timer } }

const sockethandling = (io) => {
  io.on('connection', (socket) => {
    socket.emit('connected', 'connected successfully');
    let RoomId;

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      RoomId = roomId;
      socket.emit('joined-room', roomId);
    });


    socket.on('noteTitleInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteTitleChange', data)
    })


    socket.on('noteSummaryInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteSummaryChange', data)
    })


    socket.on('noteContentInput', (data) => {
        socket.broadcast.to(RoomId).emit('noteContentChange', data)
    })



    // ...note events...

    socket.on('lock-request', () => {
      if (!RoomId) return;

      if (!roomLocks[RoomId] || roomLocks[RoomId].userId === socket.id) {
        roomLocks[RoomId] = { userId: socket.id }
        socket.broadcast.to(RoomId).emit('lock-status', { lockedBy: socket.id })
        socket.broadcast.to(RoomId).emit('user-typing')
        startLockTimer(io, RoomId, socket.id)
      } else {
        socket.emit('lock-status', { lockedBy: roomLocks[RoomId].userId })
      }
    })

    socket.on('release-lock', () => {
      if (!RoomId) return
      if (roomLocks[RoomId]?.userId === socket.id) {
        clearTimeout(roomLocks[RoomId].timer)
        delete roomLocks[RoomId]
        socket.broadcast.to(RoomId).emit('lock-status', { lockedBy: null })
        socket.broadcast.to(RoomId).emit('user-stopped-typing')
      }
    })

    socket.on('typing', () => {
      if (!RoomId) return
      if (roomLocks[RoomId]?.userId === socket.id) {
        resetLockTimer(io, RoomId, socket.id, socket)
      }
    });

    socket.on('disconnect', () => {
      // Release lock if user disconnects
      if (roomLocks[RoomId]?.userId === socket.id) {
        clearTimeout(roomLocks[RoomId].timer)
        delete roomLocks[RoomId]
        socket.broadcast.to(RoomId).emit('lock-status', { lockedBy: null })
      }
    })
  })
}

function startLockTimer(io, RoomId, userId) {
  if (!roomLocks[RoomId]) return
  roomLocks[RoomId].timer = setTimeout(() => {
    if (roomLocks[RoomId]?.userId === userId) {
      delete roomLocks[RoomId]
      io.to(RoomId).emit('lock-status', { lockedBy: null })
      io.to(RoomId).emit('user-stopped-typing')

    }
  }, 20000)// 20 seconds
}

function resetLockTimer(io, RoomId, userId) {
  if (!roomLocks[RoomId]) return;
  clearTimeout(roomLocks[RoomId].timer)
  startLockTimer(io, RoomId, userId)
}

export default sockethandling;