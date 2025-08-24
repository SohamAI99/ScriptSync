const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Store active connections by script
const scriptRooms = new Map();
const userSockets = new Map();

const socketHandler = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Store user socket
    userSockets.set(socket.userId, socket);

    // Handle joining a script room for collaboration
    socket.on('join-script', (data) => {
      const { scriptId, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        socket.join(`script_${scriptId}`);
        
        // Track collaborators in the script
        if (!scriptRooms.has(scriptId)) {
          scriptRooms.set(scriptId, new Set());
        }
        scriptRooms.get(scriptId).add(userId);
        
        // Notify other collaborators
        socket.to(`script_${scriptId}`).emit('collaborator-joined', {
          userId,
          timestamp: new Date()
        });
        
        // Send updated collaborators list
        const collaborators = Array.from(scriptRooms.get(scriptId));
        io.to(`script_${scriptId}`).emit('collaborators-update', {
          collaborators: collaborators.map(id => ({ id, online: true }))
        });
      }
    });

    // Handle leaving a script room
    socket.on('leave-script', (data) => {
      const { scriptId, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        socket.leave(`script_${scriptId}`);
        
        // Remove from collaborators tracking
        if (scriptRooms.has(scriptId)) {
          scriptRooms.get(scriptId).delete(userId);
          
          if (scriptRooms.get(scriptId).size === 0) {
            scriptRooms.delete(scriptId);
          }
        }
        
        // Notify other collaborators
        socket.to(`script_${scriptId}`).emit('collaborator-left', {
          userId,
          timestamp: new Date()
        });
        
        // Send updated collaborators list
        if (scriptRooms.has(scriptId)) {
          const collaborators = Array.from(scriptRooms.get(scriptId));
          io.to(`script_${scriptId}`).emit('collaborators-update', {
            collaborators: collaborators.map(id => ({ id, online: true }))
          });
        }
      }
    });

    // Handle real-time content changes
    socket.on('content-change', (data) => {
      const { scriptId, content, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        // Broadcast content changes to other collaborators
        socket.to(`script_${scriptId}`).emit('content-change', {
          content,
          userId,
          timestamp: new Date()
        });
      }
    });

    // Handle cursor position updates
    socket.on('cursor-position', (data) => {
      const { scriptId, position, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        // Broadcast cursor position to other collaborators
        socket.to(`script_${scriptId}`).emit('cursor-position', {
          position,
          userId,
          timestamp: new Date()
        });
      }
    });

    // Handle text selection updates
    socket.on('text-selection', (data) => {
      const { scriptId, selection, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        // Broadcast text selection to other collaborators
        socket.to(`script_${scriptId}`).emit('text-selection', {
          selection,
          userId,
          timestamp: new Date()
        });
      }
    });

    // Handle comments in real-time
    socket.on('add-comment', (data) => {
      const { scriptId, comment, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        // Broadcast new comment to other collaborators
        socket.to(`script_${scriptId}`).emit('comment-added', {
          comment: {
            ...comment,
            userId,
            timestamp: new Date()
          }
        });
      }
    });

    // Handle comment resolution
    socket.on('resolve-comment', (data) => {
      const { scriptId, commentId, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        // Broadcast comment resolution to other collaborators
        socket.to(`script_${scriptId}`).emit('comment-resolved', {
          commentId,
          resolvedBy: userId,
          timestamp: new Date()
        });
      }
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { scriptId, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        socket.to(`script_${scriptId}`).emit('user-typing', {
          userId,
          typing: true,
          timestamp: new Date()
        });
      }
    });

    socket.on('typing-stop', (data) => {
      const { scriptId, userId } = data;
      
      if (scriptId && userId === socket.userId) {
        socket.to(`script_${scriptId}`).emit('user-typing', {
          userId,
          typing: false,
          timestamp: new Date()
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove from all script rooms
      for (const [scriptId, collaborators] of scriptRooms.entries()) {
        if (collaborators.has(socket.userId)) {
          collaborators.delete(socket.userId);
          
          // Notify other collaborators
          socket.to(`script_${scriptId}`).emit('collaborator-left', {
            userId: socket.userId,
            timestamp: new Date()
          });
          
          // Send updated collaborators list
          if (collaborators.size === 0) {
            scriptRooms.delete(scriptId);
          } else {
            const remainingCollaborators = Array.from(collaborators);
            io.to(`script_${scriptId}`).emit('collaborators-update', {
              collaborators: remainingCollaborators.map(id => ({ id, online: true }))
            });
          }
        }
      }
      
      // Remove from user sockets
      userSockets.delete(socket.userId);
    });
  });
};

module.exports = socketHandler;