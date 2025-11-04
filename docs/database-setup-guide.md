# Database Setup Guide

## Firebase Firestore Collections

Your PASS application uses Firebase Firestore, which is a NoSQL document database. Unlike traditional SQL databases, Firestore automatically creates collections when you first add documents to them.

### Collections Overview

#### 1. **tasks** Collection
- **Purpose**: Stores all user tasks
- **Auto-created**: Yes, when first task is added
- **Document Structure**:
  ```javascript
  {
    title: "Task title",
    plan: "A|B|C", // Priority level
    description: "Optional task description",
    deadline: "2025-01-15", // Optional date string
    completed: false,
    imageUrl: "Optional image URL",
    archived: false,
    userId: "user-uid",
    order: 0, // For drag-and-drop ordering
    createdAt: timestamp,
    updatedAt: timestamp
  }
  ```

#### 2. **users** Collection (Optional)
- **Purpose**: Store additional user profile information
- **Auto-created**: When user registers
- **Note**: User authentication is handled by Firebase Auth, not this collection

#### 3. **archived** Concept
- **Implementation**: Tasks with `archived: true` in the `tasks` collection
- **No separate collection needed**: This keeps all task data in one place

## Firebase Security Rules

Your `firebase-firestore-rules.json` file properly configures:
- Users can only read/write their own tasks
- Authentication required for all operations
- Proper userId validation

## Firestore vs Traditional Database

**Important**: In Firebase Firestore:
- No "tables" like SQL databases
- No need to manually create collections
- Collections are created automatically when you add documents
- Go to Firebase Console → Firestore Database to see your data

## Troubleshooting Task Creation

### Common Issues & Solutions

#### 1. "Failed to add task" Error
**Most likely causes**:
- User not authenticated (not signed in)
- Firestore rules blocking the operation
- Network connectivity issues

**Solutions**:
1. Ensure user is signed in
2. Check browser console for detailed error messages
3. Verify Firebase project configuration

#### 2. Authentication Issues
- Make sure you're signed in before creating tasks
- Check if Firebase Auth is working properly
- Verify user creation in Firebase Console

#### 3. Permission Denied
- Check Firestore security rules are deployed
- Ensure rules allow authenticated users to create tasks
- Verify userId matches in task document

### Testing Task Creation

1. **Start the application**: `npm run serve`
2. **Sign in** with a test account
3. **Navigate to TSK page**
4. **Create a test task**:
   - Enter task title
   - Select plan (A, B, or C)
   - Optional: Add description and deadline
   - Click "Add Task"
5. **Check console** for success/error messages
6. **Verify in Firebase Console** that task appears in Firestore

### Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pass-f417f`
3. Navigate to **Firestore Database**
4. You should see:
   - **No collections initially** (normal)
   - **tasks collection** appears after first task creation
   - **Data structure** as shown above

### User Authentication

- **Managed by Firebase Auth**
- **No separate users collection required** for basic functionality
- User data stored in Firebase Auth, not Firestore
- User ID used to filter tasks by owner

## Success Indicators

✅ **Task creation working**:
- "Task created successfully!" message appears
- Task appears in the list immediately
- Console shows successful operation
- Data visible in Firebase Console

❌ **Issues**:
- Generic error messages
- Tasks not appearing in list
- Permission denied errors
- Authentication problems

## Next Steps

1. **Test the application** with the improved error handling
2. **Check browser console** for detailed error information
3. **Verify Firebase Console** for data presence
4. **Contact support** with specific error messages if issues persist

The application is now configured to provide detailed error information to help diagnose any remaining issues.