# Authentication Routes Documentation

## Overview

This project now includes complete authentication functionality with signup and login routes. The authentication system uses:
- **JWT (JSON Web Tokens)** for secure session management
- **bcryptjs** for password hashing
- **MongoDB** for user storage

## API Routes

### 1. Signup Route
**Endpoint:** `POST /api/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing required fields or validation errors
- `409`: User already exists
- `500`: Server error

---

### 2. Login Route
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing required fields or validation errors
- `401`: Invalid email or password
- `500`: Server error

---

## Frontend Usage Examples

### Using fetch API

#### Signup Example
```javascript
async function signup(username, email, password) {
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Signup successful!', data);
      return data;
    } else {
      console.error('Signup failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Login Example
```javascript
async function login(email, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage or cookies
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('Login successful!', data);
      return data;
    } else {
      console.error('Login failed:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Making Authenticated Requests
```javascript
async function fetchProtectedData() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found. Please login first.');
    return;
  }

  try {
    const response = await fetch('/api/protected-route', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Protected data:', data);
      return data;
    } else {
      console.error('Failed to fetch protected data:', data.error);
      
      // If token is invalid or expired, redirect to login
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
      }
      
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Logout
```javascript
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page or home
  window.location.href = '/login';
}
```

---

## React Component Example

```jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard or home
        router.push('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Creating Protected Routes

To protect your API routes, use the `verifyAuth` middleware from `app/lib/auth.js`:

```javascript
import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectDB from "@/app/lib/dbConnect";

export async function GET(request) {
  // Verify authentication
  const authResult = await verifyAuth(request);
  
  // If authResult is a NextResponse, it means auth failed
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // Auth succeeded, access user data
  const userId = authResult.userId;
  const userEmail = authResult.email;

  // Connect to database
  await connectDB();

  // Your protected route logic here
  // ...

  return NextResponse.json({ 
    message: "Success",
    userId,
    userEmail
  });
}
```

---

## Environment Variables

Make sure your `.env` file contains:

```env
MONGODB_URI=mongodb://localhost:27017/localservice
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

⚠️ **Important:** Change the `JWT_SECRET` to a strong, random string in production!

---

## Security Best Practices

1. **JWT_SECRET**: Use a strong, random secret in production (at least 32 characters)
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Expiry**: Tokens expire after 7 days. Consider implementing refresh tokens for better UX
4. **Password Requirements**: Current minimum is 6 characters. Consider enforcing stronger requirements
5. **Rate Limiting**: Consider adding rate limiting to prevent brute force attacks
6. **Cookie Storage**: For better security, consider storing tokens in HTTP-only cookies instead of localStorage

---

## Testing the Routes

You can test the routes using tools like Postman, curl, or fetch:

### Using curl:

**Signup:**
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Protected Route:**
```bash
curl -X GET http://localhost:3000/api/protected-route \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
