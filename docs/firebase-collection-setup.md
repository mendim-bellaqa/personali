# Firebase Collection Setup - Step by Step Guide

## 🎯 Quick Setup for Project Collection

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **pass-f417f**
3. Navigate to **Firestore Database** in the left sidebar

### Step 2: Create the Collection
1. Click **"Start Collection"** button
2. **Collection ID**: Enter exactly `projects` (lowercase, plural)
3. Click **"Next"**

### Step 3: Create Your First Document
You'll need to create at least one document to test the system. Here's how to fill the fields:

#### Document ID
- Leave **"Document ID"** empty (Firebase will auto-generate)
- Click **"Save"** after adding fields

#### Field Configuration

Fill in these fields exactly as shown:

| Field Name | Type | Value | Description |
|------------|------|-------|-------------|
| `title` | string | `Website Redesign Project` | Your project name |
| `description` | string | `Complete redesign of company website with modern UI/UX principles` | Project description |
| `status` | string | `active` | Must be: active, planning, on-hold, or completed |
| `priority` | string | `high` | Must be: low, medium, high, or urgent |
| `progress` | number | `65` | Must be between 0-100 |
| `userId` | string | `your-firebase-user-id` | Your Firebase Auth UID |
| `tasks` | array | `["task1", "task2", "task3"]` | Array of task IDs (optional) |
| `createdAt` | timestamp | `November 13, 2025, 11:55 PM` | Current date/time |
| `updatedAt` | timestamp | `November 13, 2025, 11:55 PM` | Same as createdAt |

### Step 4: Field Types and Sample Values

#### Required Fields:
```javascript
// String fields
"title": "Website Redesign Project"
"description": "Complete redesign of company website with modern UI/UX principles"
"status": "active"  // active | planning | on-hold | completed
"priority": "high"  // low | medium | high | urgent
"userId": "abc123xyz789..." // Your Firebase user ID

// Number field
"progress": 65  // 0-100

// Array field
"tasks": ["task1", "task2", "task3"]

// Timestamp fields
"createdAt": November 13, 2025, 11:55 PM
"updatedAt": November 13, 2025, 11:55 PM
```

### Step 5: Getting Your Firebase User ID

To get your actual Firebase user ID:

1. **Option A**: Add this temporary code to your app to log the current user ID:
```javascript
// Add this to your console or in a component
import { auth } from '../services/firebase.js';
console.log('Current user ID:', auth.currentUser?.uid);
```

2. **Option B**: Check your Firebase Auth users:
   - Go to **Authentication** in Firebase Console
   - Click **Users** tab
   - Copy the **User UID** value

### Step 6: Sample Project Documents

Create 2-3 sample projects with different values:

#### Project 1: "Mobile App Development"
```javascript
{
  "title": "Mobile App Development",
  "description": "Native iOS and Android app development for customer engagement",
  "status": "planning",
  "priority": "medium",
  "progress": 20,
  "userId": "your-user-id-here",
  "tasks": ["design-mockups", "api-setup", "ui-development"],
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

#### Project 2: "Database Migration"
```javascript
{
  "title": "Database Migration",
  "description": "Migrate legacy database to PostgreSQL with improved schema",
  "status": "on-hold",
  "priority": "urgent",
  "progress": 90,
  "userId": "your-user-id-here",
  "tasks": ["backup-current-db", "setup-postgres", "test-migration"],
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

#### Project 3: "Marketing Campaign"
```javascript
{
  "title": "Holiday Marketing Campaign",
  "description": "Q4 holiday season marketing campaign across all channels",
  "status": "completed",
  "priority": "high",
  "progress": 100,
  "userId": "your-user-id-here",
  "tasks": ["creative-design", "ad-copy", "campaign-launch"],
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Step 7: Setting Timestamp Values

For timestamp fields:
1. Click on **"createdAt"** field name
2. Select **"Timestamp"** as type
3. Click **"Now"** button to set current time
4. Repeat for **"updatedAt"**

### Step 8: Setting Array Values

For the `tasks` array:
1. Click on **"tasks"** field name
2. Select **"Array"** as type
3. Click **"+ Add element"** button
4. Add each task as a string
5. Click **"+ Add element"** to add more

### Step 9: Verification

After creating your documents:
1. Check that all required fields are filled
2. Verify field types are correct
3. Ensure status values match exactly: `active`, `planning`, `on-hold`, `completed`
4. Ensure priority values match exactly: `low`, `medium`, `high`, `urgent`
5. Progress should be a number between 0-100

### Step 10: Test Your Setup

1. **Save all documents**
2. **Open your Vue application**
3. **Log in** to the app
4. **Navigate to Projects page** (`/project`)
5. **Refresh the page** - your projects should appear automatically

### ⚠️ Important Notes

- **Collection Name**: MUST be `projects` (not "project")
- **User ID**: Replace `your-user-id-here` with your actual Firebase user ID
- **Field Names**: Use exact field names as shown (case-sensitive)
- **Status Values**: Only use the exact values listed above
- **Priority Values**: Only use the exact values listed above

### 🔧 Troubleshooting

If your projects don't appear:
1. Check the browser console for errors
2. Verify your Firebase configuration in `src/services/firebase.js`
3. Ensure you're logged in to the same Firebase account
4. Check that your user ID matches in the documents
5. Verify security rules allow read access for authenticated users

### 🚀 Next Steps

Once your sample data is working:
1. **Delete the sample data** once you create real projects
2. **Start using the application** to create actual projects
3. **Add more fields** as needed for your specific use case

Your Firebase collection will look like this:
```
Firestore Database
└── projects
    ├── Auto-generated-ID-1
    │   ├── title: "Website Redesign Project"
    │   ├── description: "..."
    │   ├── status: "active"
    │   └── ... (other fields)
    ├── Auto-generated-ID-2
    │   ├── title: "Mobile App Development"
    │   └── ... (other fields)
    └── Auto-generated-ID-3
        └── ... (other fields)
```

That's it! Once you have this set up, your project management system will be fully functional! 🎉