# ScriptSync 📝

A modern collaborative scriptwriting platform that enables writers, screenwriters, and creative teams to create, edit, and share scripts in real-time with multiple collaborators.

![ScriptSync Banner](https://via.placeholder.com/800x400/6366f1/white?text=ScriptSync)

## ✨ Features

- **Real-time Collaboration** - Multiple users can edit scripts simultaneously
- **Version Control** - Track changes and manage script versions
- **Role-based Access** - Writer and Monitor roles with different permissions
- **Script Sharing** - Share scripts via secure links or direct invitations
- **Rich Editor** - Professional script formatting with outline view
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Secure Authentication** - JWT-based authentication with role management

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and interactions
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls

### Backend
- **Node.js & Express** - RESTful API server
- **Socket.IO** - Real-time collaboration features
- **MySQL** - Relational database for data persistence
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **PHP** (v8.x) - for database setup scripts

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/scriptsync.git
cd scriptsync
```

### 2. Install dependencies

**Frontend:**
```bash
cd scriptsync
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### 3. Environment Setup

Create `.env` files in both directories:

**Backend `.env`:**
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:4028

DB_HOST=localhost
DB_PORT=3307
DB_NAME=scriptsync
DB_USER=root
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d

SOCKET_CORS_ORIGIN=http://localhost:4028
```

**Frontend `.env`:**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 4. Database Setup

1. Start MySQL server on port 3307
2. Import the database schema:
   ```bash
   cd backend
   node setup-db-3307.js
   ```

Or use phpMyAdmin:
- Import `backend/database/scriptsync_schema.sql`

## 🚦 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd scriptsync
npm start
```

The application will be available at:
- Frontend: `http://localhost:4028`
- Backend API: `http://localhost:3001`

### Production Build

**Build Frontend:**
```bash
cd scriptsync
npm run build
```

**Start Production Backend:**
```bash
cd backend
npm start
```

## 📁 Project Structure

```
scriptsync/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── socket/             # Socket.IO handlers
│   └── database/           # Database schemas and migrations
├── scriptsync/             # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS and styling
│   └── public/             # Static assets
└── docs/                   # Documentation
```

## 🔧 Configuration

### Database Configuration
- Default port: 3307
- Database name: `scriptsync`
- Tables: users, scripts, collaborators, comments, etc.

### Authentication
- JWT-based authentication
- Role-based access control (Writer/Monitor)
- Password hashing with bcrypt

### Real-time Features
- Socket.IO for real-time collaboration
- Live cursor tracking
- Instant script updates

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Script Endpoints
- `GET /api/scripts` - Get user scripts
- `POST /api/scripts` - Create new script
- `PUT /api/scripts/:id` - Update script
- `DELETE /api/scripts/:id` - Delete script

### Collaboration Endpoints
- `POST /api/scripts/:id/collaborators` - Invite collaborators
- `GET /api/scripts/:id/versions` - Get script versions
- `POST /api/scripts/:id/versions` - Create new version

## 🧪 Testing

```bash
# Run frontend tests
cd scriptsync
npm test

# Run backend tests
cd backend
npm test
```

## 📈 Performance

- **Frontend**: Optimized with Vite build system
- **Backend**: Express.js with optimized middleware
- **Database**: Indexed queries for fast performance
- **Real-time**: Efficient Socket.IO event handling

## 🔒 Security

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MySQL with optimized schema
- **DevOps**: Vite build system, Environment configuration

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by collaborative editing platforms
- Designed for creative professionals

---

**ScriptSync** - Collaborative Scriptwriting Made Simple 🎬