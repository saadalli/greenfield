# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greenfield is a React Native mobile application built with Expo, featuring location-based functionality and user authentication. The project consists of:

- **Frontend**: React Native app (Expo) with TypeScript
- **Backend**: Node.js/Express REST API with MySQL database

## Development Commands

### Frontend (React Native/Expo)

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Backend (Node.js/Express)

```bash
cd greenfield-backend

# Start production server
npm start

# Start development server with auto-reload
npm run dev
```

## Architecture

### Project Structure

```
/
├── App.tsx                    # Root navigation setup
├── screens/                   # React Native screen components
│   ├── LocationPermissionScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── ResetPasswordScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── WelcomeScreen.tsx
│   └── AddLocationScreen.tsx
├── api/                       # Frontend API client modules
│   ├── axiosConfig.js         # Axios instance with interceptors
│   ├── authAPI.js
│   ├── locationAPI.js
│   └── userAPI.js
└── greenfield-backend/        # Backend server
    ├── server.js              # Express server entry point
    ├── config/
    │   └── database.js        # MySQL connection pool
    ├── routes/                # Express route definitions
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   └── locationRoutes.js
    ├── controllers/           # Route handler logic
    │   ├── authController.js
    │   ├── userController.js
    │   └── locationController.js
    ├── middleware/
    │   └── authMiddleware.js  # JWT authentication
    └── models/
        └── queries.sql        # Database schema

```

### Frontend Architecture

**Navigation**: React Navigation v7 with Stack Navigator
- Type-safe navigation using `RootStackParamList`
- Navigation is configured in `App.tsx`
- Initial route: `LocationPermissionScreen`

**API Communication**:
- Centralized Axios configuration in `api/axiosConfig.js`
- Request interceptor auto-adds JWT token from AsyncStorage
- Response interceptor handles common errors (401, 403, 404, 500)
- On 401 responses, automatically clears auth token and user data
- API base URL: `http://localhost:3000/api` (change for physical devices/production)

**State Management**:
- AsyncStorage for persistent auth token and user data
- Helper functions in `axiosConfig.js`: `setAuthToken()`, `getAuthToken()`, `removeAuthToken()`, `setUserData()`, `getUserData()`

### Backend Architecture

**Server Setup**:
- Express 5.x server on port 3000 (configurable via `PORT` env var)
- MySQL 2 database connection pool
- CORS enabled for all origins (configure for production)
- Request logging middleware logs all requests with timestamp

**Database Connection**:
- Connection pool configured in `config/database.js`
- Helper function `query()` for executing SQL with automatic error logging
- Supports transactions via `getConnection()`
- Graceful shutdown handling on SIGTERM/SIGINT
- Connection test on startup

**Authentication Flow**:
1. User signup/login returns JWT token (default 7d expiry)
2. Token stored in AsyncStorage on mobile app
3. Protected routes use `authenticateToken` middleware
4. Middleware verifies JWT and attaches user info to `req.user`
5. Password reset flow uses temporary tokens in `password_resets` table

**API Structure**:
- All routes follow REST conventions
- Controllers handle business logic and database queries
- Routes in `routes/` define endpoints and validation
- express-validator used for input validation

### API Endpoints

**Authentication** (`/api/auth/*`):
- `POST /signup` - Register new user
- `POST /login` - Authenticate user
- `POST /forgot-password` - Request password reset token
- `POST /reset-password` - Reset password with token
- `POST /logout` - Client-side logout

**User** (`/api/user/*`) - All protected routes:
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `DELETE /account` - Delete account

**Location** (`/api/location/*`) - All protected routes:
- `POST /add` - Add new location
- `GET /list` - List user's locations
- `GET /default` - Get default location
- `PUT /set-default/:id` - Set default location
- `PUT /update/:id` - Update location
- `DELETE /delete/:id` - Delete location

## Environment Configuration

### Backend `.env` (greenfield-backend/)

Required environment variables:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greenfieldsuperm_db_local
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

NODE_ENV=development
PORT=3000
```

### Frontend `.env`

```
PUBLIC_BUILDER_KEY=<key>
```

## Database

- Database engine: MySQL
- Schema defined in `greenfield-backend/models/queries.sql`
- Main tables: `users`, `locations`, `password_resets`
- Use `greenfield-backend/seed.js` for seeding test data

## Key Implementation Details

**JWT Token Structure**:
```javascript
{
  id: userId,
  email: user.email,
  name: user.name
}
```

**Protected Route Pattern**:
```javascript
router.get('/profile', authenticateToken, controller.getProfile);
```
The `authenticateToken` middleware populates `req.user` with decoded JWT data.

**Password Reset Flow**:
1. User requests reset via email
2. Server generates crypto token, stores in `password_resets` table with 24h expiry
3. Token sent to user (in development, returned in response)
4. User submits token + new password
5. Server validates token, updates password, deletes token

**Mobile API Base URL**:
- Development (emulator): `http://localhost:3000/api`
- Development (physical device): `http://<YOUR_IP>:3000/api`
- Configure in `api/axiosConfig.js` line 10

## Common Modifications

**Adding a new protected route**:
1. Define route in `routes/` file with `authenticateToken` middleware
2. Create controller function in `controllers/`
3. Access authenticated user via `req.user.id`, `req.user.email`, `req.user.name`

**Adding a new screen**:
1. Create screen component in `screens/`
2. Add route type to `RootStackParamList` in `App.tsx`
3. Add `Stack.Screen` to navigator in `App.tsx`

**Database queries**:
- Use parameterized queries via `query(sql, params)` helper
- Never concatenate user input into SQL strings
- For transactions, use `getConnection()` and manually manage connection

## Development Notes

- Frontend uses Expo new architecture (`newArchEnabled: true`)
- Backend logs all queries in debug mode (`LOG_LEVEL=debug`)
- Password reset tokens shown in dev response for testing
- CORS currently allows all origins - restrict in production
