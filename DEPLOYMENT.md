# ScriptSync Deployment Guide

This guide explains how to deploy both the frontend and backend of ScriptSync to Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Git repository with your ScriptSync code
3. Node.js installed locally (for testing)

## Frontend Deployment

### 1. Prepare the Frontend

The frontend is already configured for Vercel deployment with:
- `vercel.json` file for build configuration
- Vite build process configured

### 2. Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository or upload the `scriptsync` folder
4. Configure the project:
   - Framework Preset: Vite
   - Root Directory: `scriptsync`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variables if needed:
   - `VITE_API_URL` - URL of your deployed backend
6. Click "Deploy"

### 3. Update API Configuration

After deploying the backend, update the frontend API configuration:
1. Edit `scriptsync/src/services/api.js`
2. Update `API_BASE_URL` to point to your deployed backend URL

## Backend Deployment

### 1. Prepare the Backend

The backend has been adapted for Vercel's serverless functions:
- Individual API endpoints in the `api/` directory
- Vercel-compatible routing in `vercel.json`
- Database connection maintained through `config/database.js`

### 2. Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository or upload the `backend` folder
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: `backend`
   - Build Command: (leave empty - Vercel will auto-detect)
   - Output Directory: (leave empty)
5. Add environment variables:
   - `DB_HOST` - Your database host
   - `DB_PORT` - Your database port (3307)
   - `DB_NAME` - Your database name (scriptsync)
   - `DB_USER` - Your database user (root)
   - `DB_PASSWORD` - Your database password
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRES_IN` - JWT expiration time (7d)
6. Click "Deploy"

## Database Setup

ScriptSync requires a MySQL database. You'll need to set up your database separately:

1. Create a MySQL database (e.g., on PlanetScale, AWS RDS, or similar)
2. Import the schema from `scriptsync_schema.sql`
3. Update the database connection variables in Vercel

## Environment Variables

### Frontend Variables
- `VITE_API_URL` - Backend API URL

### Backend Variables
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES_IN` - JWT expiration time

## Post-Deployment Steps

1. Update the frontend to use the deployed backend URL
2. Test all functionality:
   - User registration and login
   - Profile updates
   - Script creation and editing
3. Monitor logs in the Vercel dashboard for any issues

## Troubleshooting

1. **CORS Issues**: Ensure your backend allows requests from your frontend domain
2. **Database Connection**: Verify all database environment variables are correctly set
3. **API Errors**: Check Vercel logs for detailed error messages

## Notes

- The backend uses serverless functions which are stateless
- Database connections are managed per request
- File uploads may require additional configuration for production use
- WebSocket functionality may need alternative implementation for serverless environments