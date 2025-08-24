# ScriptSync Backend

A Node.js/Express backend API for ScriptSync - a real-time collaborative script writing platform.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Real-time Collaboration**: Socket.IO integration for live editing and presence
- **Script Management**: Full CRUD operations for scripts with version control
- **Collaboration Tools**: Comments, invitations, and role management
- **File Uploads**: Avatar and document upload support
- **Activity Logging**: Comprehensive audit trail
- **Database Integration**: MySQL with migration support

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

Before running the backend, ensure you have:

- Node.js (v14 or higher)
- MySQL server running
- npm or yarn package manager

## Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=scriptsync
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Set up the database:**
   ```bash
   npm run migrate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/settings` - Update user settings
- `POST /api/users/avatar` - Upload user avatar
- `PUT /api/users/password` - Change password
- `GET /api/users/activity` - Get user activity logs

### Scripts
- `GET /api/scripts` - Get all scripts (with pagination and filters)
- `GET /api/scripts/:id` - Get single script
- `POST /api/scripts` - Create new script
- `PUT /api/scripts/:id` - Update script
- `DELETE /api/scripts/:id` - Delete script
- `POST /api/scripts/:id/versions` - Create script version
- `GET /api/scripts/:id/versions` - Get script versions

### Collaboration
- `POST /api/collaboration/invite` - Invite collaborator
- `GET /api/collaboration/script/:id/collaborators` - Get script collaborators
- `PUT /api/collaboration/collaborator/:id` - Update collaborator role
- `DELETE /api/collaboration/collaborator/:id` - Remove collaborator
- `POST /api/collaboration/comment` - Add comment
- `GET /api/collaboration/script/:id/comments` - Get script comments
- `PUT /api/collaboration/comment/:id/resolve` - Resolve comment
- `POST /api/collaboration/presence` - Update user presence

## Real-time Events

The backend supports real-time collaboration through Socket.IO:

### Connection Events
- `join_script` - Join a script room for collaboration
- `leave_script` - Leave a script room
- `disconnect` - Handle user disconnection

### Collaboration Events
- `text_change` - Real-time text editing
- `cursor_move` - Cursor position updates
- `selection_change` - Text selection sharing
- `typing_start/stop` - Typing indicators
- `save_script` - Save script content

### Broadcast Events
- `user_joined/left` - User presence notifications
- `text_changed` - Text change notifications
- `cursor_moved` - Cursor position updates
- `user_typing` - Typing indicator updates
- `script_saved` - Save confirmations

## Database Schema

The backend uses MySQL with the following main tables:

- **users** - User accounts and preferences
- **scripts** - Script content and metadata
- **collaborators** - Script collaboration relationships
- **comments** - Script comments and discussions
- **script_versions** - Version control for scripts
- **activity_logs** - User activity tracking
- **notifications** - User notifications
- **sessions** - Real-time session management

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- Security headers with Helmet

## Development

### Scripts Available

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

### Project Structure

```
backend/
├── config/           # Database and configuration
├── database/         # Migration scripts
├── middleware/       # Express middleware
├── routes/          # API route handlers
├── socket/          # Socket.IO handlers
├── uploads/         # File upload directory
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## Error Handling

The backend includes comprehensive error handling:

- Validation errors with detailed messages
- Database connection error handling
- JWT token validation errors
- File upload error handling
- Real-time connection error handling

## Logging

- HTTP request logging with Morgan
- Database query error logging
- Socket.IO connection logging
- Activity logging for audit trails

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use a process manager like PM2
3. Set up proper database credentials
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure proper CORS origins
7. Set strong JWT secrets

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass
5. Submit pull requests

## License

This project is licensed under the MIT License.