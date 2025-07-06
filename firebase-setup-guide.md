# Firebase Integration Guide for SportSphere

## Overview
This guide will help you integrate Firebase Authentication and Firestore for user management and data storage in your SportSphere app.

## Prerequisites
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore Database
3. Get your Firebase configuration

## Installation

```bash
npm install firebase
```

## Firebase Configuration

Create `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## Authentication Hook

Create `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return { user, loading, login, register, logout };
};
```

## Firestore Data Service

Create `src/services/firestore.ts`:

```typescript
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Posts
export const createPost = async (postData: any) => {
  return addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getPosts = async (limitCount = 20) => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Users
export const createUserProfile = async (userId: string, userData: any) => {
  return updateDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getUserProfile = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Following/Followers
export const followUser = async (followerId: string, followingId: string) => {
  return addDoc(collection(db, 'follows'), {
    followerId,
    followingId,
    createdAt: new Date()
  });
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const q = query(
    collection(db, 'follows'),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  const snapshot = await getDocs(q);
  snapshot.docs.forEach(doc => deleteDoc(doc.ref));
};
```

## Storage Service

Create `src/services/storage.ts`:

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const uploadVideo = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
```

## Authentication Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext<any>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
```

## Implementation Steps

1. **Wrap your app with AuthProvider**:
```typescript
// In main.tsx
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
```

2. **Create Login/Register components**
3. **Replace mock data with Firebase calls**
4. **Add real-time listeners for posts and messages**
5. **Implement image/video upload functionality**

## Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts are readable by all authenticated users
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Follows
    match /follows/{followId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.followerId;
    }
  }
}
```

## Benefits of Firebase Integration

1. **Real-time updates** - Posts, messages, and notifications update instantly
2. **Scalable authentication** - Handle millions of users
3. **Offline support** - App works without internet connection
4. **Security** - Built-in security rules and authentication
5. **Analytics** - Track user engagement and app performance
6. **Push notifications** - Engage users with timely updates

## Next Steps

1. Set up Firebase project
2. Install dependencies
3. Configure Firebase
4. Implement authentication
5. Replace mock data with Firestore
6. Add real-time features
7. Implement file uploads
8. Set up push notifications