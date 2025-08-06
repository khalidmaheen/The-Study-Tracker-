# Study Edit Tracker - Backend Implementation Contracts

## Overview
This document outlines the API contracts and implementation plan for converting the frontend mock data into a full-stack application with user authentication and data persistence.

## Current Frontend Mock Data (to be replaced)
- **User Authentication**: Currently using localStorage with mock login
- **Study Sessions**: Hardcoded in mockData.js with sample sessions
- **Subjects**: Pre-defined subjects array with Grade 12 South African subjects
- **Goals**: Static daily/weekly goals structure
- **Analytics**: Calculated from mock session data

## API Contracts

### 1. Authentication Endpoints

#### POST `/api/auth/register`
```json
{
  "name": "Alex Student",
  "email": "alex@example.com", 
  "password": "password",
  "grade": 12
}
```
Response: `{ "token": "jwt_token", "user": {...} }`

#### POST `/api/auth/login`
```json
{
  "email": "alex@example.com",
  "password": "password"
}
```
Response: `{ "token": "jwt_token", "user": {...} }`

#### GET `/api/auth/me` (Protected)
Response: `{ "user": {...} }`

### 2. Study Sessions

#### GET `/api/sessions` (Protected)
Response: Array of user's study sessions

#### POST `/api/sessions/start` (Protected)
```json
{
  "subjectId": "subject_id",
  "moodBefore": 5
}
```
Response: Active session object

#### PUT `/api/sessions/:id/end` (Protected)
```json
{
  "focusRating": 8,
  "distractionRating": 3,
  "moodAfter": 7,
  "notes": "Good session",
  "distractionSource": "Phone notifications"
}
```
Response: Completed session object

### 3. Subjects Management

#### GET `/api/subjects` (Protected)
Response: Array of user's subjects (default + custom)

#### POST `/api/subjects` (Protected)
```json
{
  "name": "Advanced Programming",
  "color": "#3B82F6",
  "icon": "BookOpen"
}
```
Response: Created subject object

### 4. Goals Management

#### GET `/api/goals` (Protected)
Response: User's current goals

#### PUT `/api/goals` (Protected)
```json
{
  "dailyStudyTime": 4,
  "weeklySubjectGoals": [
    { "subjectId": "id", "targetHours": 8 }
  ]
}
```
Response: Updated goals object

### 5. Analytics

#### GET `/api/analytics/weekly` (Protected)
Response: Weekly statistics and trends

#### GET `/api/analytics/subjects` (Protected) 
Response: Subject-wise performance data

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  grade: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  color: String,
  icon: String,
  isCustom: Boolean,
  isDefault: Boolean,
  createdAt: Date
}
```

### StudySession Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  subjectId: ObjectId,
  startTime: Date,
  endTime: Date,
  duration: Number, // minutes
  focusRating: Number (1-10),
  distractionRating: Number (1-10),
  moodBefore: Number (1-10),
  moodAfter: Number (1-10),
  notes: String,
  distractionSource: String,
  createdAt: Date
}
```

### Goals Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  dailyStudyTime: Number, // hours
  weeklySubjectGoals: [{
    subjectId: ObjectId,
    targetHours: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration Plan

### 1. Authentication Context Updates
- Replace localStorage mock with JWT token management
- Update login/signup functions to call real API endpoints
- Add token refresh logic and error handling

### 2. Study Context Updates  
- Replace mockData imports with API calls
- Update startSession/endSession to use backend endpoints
- Add real-time session management with proper state sync

### 3. API Service Layer
- Create `/frontend/src/services/api.js` for centralized API calls
- Implement axios interceptors for token management
- Add proper error handling and loading states

### 4. Data Migration
- Remove all mock data dependencies
- Update analytics calculations to use real data
- Ensure proper loading states during API calls

## Implementation Steps

1. **Backend Models & Database Setup**
   - Create MongoDB models for User, Subject, StudySession, Goals
   - Set up default Grade 12 subjects for new users

2. **Authentication System**
   - JWT token generation and validation
   - Password hashing with bcrypt
   - Protected route middleware

3. **Core CRUD Operations**
   - Study session tracking with proper timing
   - Subject management (default + custom)
   - Goals management with validation

4. **Analytics Engine**
   - Weekly/monthly statistics calculation
   - Subject performance aggregation
   - Trend analysis algorithms

5. **Frontend Integration**
   - Replace mock contexts with API calls
   - Add proper loading and error states
   - Test all user flows end-to-end

## Key Features to Maintain
- Real-time session timer functionality
- Smooth user experience with optimistic updates
- Comprehensive analytics and insights
- Goal tracking and progress visualization
- Student-friendly, minimal UI design

## Future Enhancements (Post-MVP)
- Data export for students' records
- Study schedule recommendations based on patterns
- Focus effectiveness correlations and insights
- Mobile app companion
- Study group features for collaboration