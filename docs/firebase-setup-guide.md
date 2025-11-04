# Firebase Setup Guide for Pass App

## 🔧 **Quick Setup Instructions**

### **1. Enable Firebase Authentication**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **pass-f417f**
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Enable **Google** provider

### **2. Set Up Firestore Database**
1. Go to **Firestore Database** in Firebase Console
2. Create database in **production mode**
3. Copy the rules from `firebase-firestore-rules.json` and paste them in the **Rules** tab:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```
4. Click **Publish**

### **3. Install Required Dependencies**
Run these commands in your terminal:
```bash
npm install firebase
npm install --save-dev @types/firebase
```

### **4. Test the App**
1. Start the development server: `npm run dev`
2. Register a new account with email/password
3. Try adding tasks
4. Complete tasks and archive them
5. Check the Archive page

## 🚨 **Common Issues & Solutions**

### **"Failed to add task" Error**
- **Cause**: Firestore rules not configured correctly
- **Solution**: Follow step 2 above to set up Firestore rules

### **Authentication Issues**
- **Cause**: Authentication providers not enabled
- **Solution**: Enable both Email/Password and Google in Firebase Console

### **"operation-not-allowed" Error**
- **Cause**: Email/Password auth is disabled
- **Solution**: Enable Email/Password in Authentication settings

## 📊 **Database Schema**
Your Firestore will have a `tasks` collection with this structure:
```javascript
{
  id: "auto-generated",
  title: "Task title",
  description: "Task description",
  plan: "A" | "B" | "C",
  deadline: "2024-01-01" | null,
  completed: false,
  archived: false,
  imageUrl: "URL" | null,
  order: 0,
  userId: "firebase-user-uid",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  completedAt: "timestamp" | null
}
```

## ✅ **Verification Checklist**
- [ ] Firebase Authentication enabled (Email/Password + Google)
- [ ] Firestore Database created
- [ ] Firestore rules published
- [ ] Dependencies installed
- [ ] App builds without errors
- [ ] Registration works
- [ ] Login works
- [ ] Task creation works
- [ ] Task archive works

## 🆘 **Need Help?**
If you encounter issues:
1. Check Firebase Console for error logs
2. Ensure your Firebase config is correct in `src/services/firebase.js`
3. Verify Firestore rules are properly published
4. Test with a fresh browser cache

The app is now production-ready with:
- ✅ Secure user authentication
- ✅ Cloud-based task storage
- ✅ Real-time synchronization
- ✅ Archive functionality
- ✅ Mobile-responsive design