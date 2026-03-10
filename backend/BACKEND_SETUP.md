# Backend Setup & API Documentation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   ├── quizController.js # Quiz CRUD operations
│   │   └── resultController.js # Result recording & retrieval
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Quiz.js           # Quiz schema
│   │   └── Result.js         # Result schema
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── roleCheck.js      # Role-based access
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   └── resultRoutes.js
│   ├── utils/
│   │   └── errorHandler.js
│   └── server.js             # Main server entry
├── package.json
├── .env
└── .gitignore
```

## MVC Architecture

### Model Layer (`/models`)
- Defines database schemas using Mongoose
- Includes validation rules
- Methods for data transformation
- Indexes for query optimization

### Controller Layer (`/controllers`)
- Handles incoming requests
- Validates request data
- Interacts with models
- Sends responses

### Routes Layer (`/routes`)
- Maps HTTP methods to controllers
- Applies middleware
- Defines API endpoints

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your_super_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB
Before running the server, ensure MongoDB is running:

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "creator" | "candidate"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "creator"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Quiz Routes

#### Get All Quizzes (Public)
```
GET /quizzes
Authorization: Bearer <token> (optional)

Response (200):
{
  "success": true,
  "count": 5,
  "quizzes": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "JavaScript Basics",
      "description": "...",
      "creatorName": "john_doe",
      "questions": [...],
      "duration": 300,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Quiz by ID
```
GET /quizzes/:id
Authorization: Bearer <token> (optional)

Response (200):
{
  "success": true,
  "quiz": { ... }
}
```

#### Create Quiz (Creator only)
```
POST /quizzes
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "JavaScript Basics",
  "description": "Learn JS fundamentals",
  "duration": 300,
  "questions": [
    {
      "question": "What is JavaScript?",
      "options": ["Language", "Framework", "Library", "Tool"],
      "correctAnswer": 0
    }
  ]
}

Response (201):
{
  "success": true,
  "message": "Quiz created successfully",
  "quiz": { ... }
}
```

#### Get My Quizzes (Creator only)
```
GET /quizzes/creator/my-quizzes
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 3,
  "quizzes": [ ... ]
}
```

#### Update Quiz (Creator only)
```
PUT /quizzes/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "description": "...",
  "questions": [ ... ]
}

Response (200):
{
  "success": true,
  "message": "Quiz updated successfully",
  "quiz": { ... }
}
```

#### Delete Quiz (Creator only)
```
DELETE /quizzes/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

### Result Routes

#### Submit Quiz (Candidate only)
```
POST /results/submit
Content-Type: application/json
Authorization: Bearer <token>

{
  "quizId": "507f1f77bcf86cd799439012",
  "answers": [0, 1, 2, 3],
  "timeTaken": 150
}

Response (201):
{
  "success": true,
  "message": "Quiz submitted successfully",
  "result": {
    "id": "507f1f77bcf86cd799439013",
    "score": 3,
    "totalQuestions": 4,
    "percentage": 75,
    "grade": "C"
  }
}
```

#### Get Result by ID
```
GET /results/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "result": {
    "_id": "507f1f77bcf86cd799439013",
    "quizId": { "title": "..." },
    "userId": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "quizTitle": "JavaScript Basics",
    "score": 3,
    "totalQuestions": 4,
    "percentage": 75,
    "grade": "C",
    "answers": [ ... ],
    "timeTaken": 150,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get My Results (Candidate only)
```
GET /results/candidate/my-results
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 5,
  "results": [ ... ]
}
```

#### Get Quiz Results (Creator only)
```
GET /results/quiz/:quizId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 10,
  "stats": {
    "totalAttempts": 10,
    "averageScore": 7.5,
    "averagePercentage": 75.5
  },
  "results": [ ... ]
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `409` - Conflict (duplicate username/email)
- `500` - Server Error

## Middleware

### Authentication Middleware (`auth.js`)
- Verifies JWT token
- Extracts user ID and role
- Passes to next middleware/controller

### Role Check Middleware (`roleCheck.js`)
- Checks user role (creator/candidate)
- Denies access if role doesn't match

## Database Models

### User
```javascript
{
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String (hashed),
  role: 'creator' | 'candidate',
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz
```javascript
{
  title: String,
  description: String,
  creatorId: ObjectId (ref: User),
  creatorName: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  duration: Number,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Result
```javascript
{
  quizId: ObjectId (ref: Quiz),
  userId: ObjectId (ref: User),
  username: String,
  quizTitle: String,
  answers: [{
    questionIndex: Number,
    question: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean
  }],
  score: Number,
  totalQuestions: Number,
  percentage: Number,
  timeTaken: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing with cURL or Postman

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "creator"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Deployment

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/quiz-app
JWT_SECRET=very_long_random_string_min_32_chars
PORT=5000
NODE_ENV=production
```

### Deploy Steps
1. Ensure all environment variables are set
2. Use MongoDB Atlas for cloud database
3. Deploy to Heroku, Railway, or similar
4. Update frontend API URL to production endpoint
