# Firebase Firestore Database Setup Guide

## Project Management System Database Configuration

### Overview
This guide will help you set up the Firebase Firestore database for the enhanced Project Management System with liquid glass UI.

## Database Structure

### Projects Collection (`projects`)

The main collection for storing all project data:

```
projects/
├── {projectId}
    ├── title: string (required)
    ├── description: string (optional)
    ├── status: string (enum: 'active', 'planning', 'on-hold', 'completed')
    ├── priority: string (enum: 'low', 'medium', 'high', 'urgent')
    ├── progress: number (0-100)
    ├── userId: string (Firebase Auth UID)
    ├── tasks: array of task IDs
    ├── createdAt: timestamp
    ├── updatedAt: timestamp
    └── archived: boolean (optional)
```

### Database Schema Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | string | Yes | Project name/title | "Website Redesign" |
| `description` | string | No | Project description | "Complete redesign of company website with modern UI" |
| `status` | string | Yes | Current project status | "active" |
| `priority` | string | Yes | Project priority level | "high" |
| `progress` | number | No | Completion percentage | 75 |
| `userId` | string | Yes | Firebase Auth user ID | "abc123xyz..." |
| `tasks` | array | No | Array of task IDs | ["task1", "task2"] |
| `createdAt` | timestamp | Yes | Creation date | ServerTimestamp |
| `updatedAt` | timestamp | Yes | Last update date | ServerTimestamp |
| `archived` | boolean | No | Archive flag | false |

### Enums

**Status Values:**
- `active` - Project is currently being worked on
- `planning` - Project is in planning phase
- `on-hold` - Project is temporarily paused
- `completed` - Project has been completed

**Priority Values:**
- `low` - Low priority project
- `medium` - Medium priority project
- `high` - High priority project
- `urgent` - Urgent/critical priority project

## Setup Steps

### 1. Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (pass-f417f)
3. Navigate to **Firestore Database**
4. Click **Create database**
5. Choose **Start in test mode** (for development)
6. Select a location (choose the closest to your users)

### 2. Set Up Database Structure

#### Create the projects collection:

1. In the Firestore console, click **Start collection**
2. Collection ID: `projects`
3. Click **Next**

#### Create a sample document to test:

```javascript
// First document (Auto-ID)
{
  "title": "Website Redesign Project",
  "description": "Complete redesign of company website with modern UI/UX principles",
  "status": "active",
  "priority": "high",
  "progress": 65,
  "userId": "your-user-id-here",
  "tasks": ["task1", "task2", "task3"],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### 3. Configure Security Rules

Go to **Rules** tab in Firestore Database section and implement the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection
    match /projects/{projectId} {
      // Allow read/write access only to authenticated users
      // and only for documents they own
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Allow create operations
      allow create: if request.auth != null && 
                    request.resource.data.userId == request.auth.uid &&
                    validateProjectData(request.resource.data);
      
      // Allow update operations with additional validation
      allow update: if request.auth != null && 
                    request.auth.uid == resource.data.userId &&
                    validateProjectData(request.resource.data);
      
      // Allow delete operations
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Helper function to validate project data structure
    function validateProjectData(project) {
      return project.keys().hasAll(['title', 'status', 'priority', 'userId']) &&
             project.title is string &&
             project.title.size() > 0 &&
             project.title.size() <= 200 &&
             project.status in ['active', 'planning', 'on-hold', 'completed'] &&
             project.priority in ['low', 'medium', 'high', 'urgent'] &&
             project.progress >= 0 &&
             project.progress <= 100 &&
             project.userId is string &&
             project.userId.size() > 0;
    }
  }
}
```

### 4. Create Indexes (Optional - for better performance)

In the Firebase Console, go to **Indexes** tab and create the following composite indexes:

#### For filtering projects by user and status:
```javascript
Collection: projects
Fields to index:
- userId Ascending
- status Ascending
- createdAt Descending
```

#### For filtering projects by user and priority:
```javascript
Collection: projects
Fields to index:
- userId Ascending
- priority Ascending
- createdAt Descending
```

### 5. Test the Setup

You can test your database setup using Firebase Console or by running the application. The project service will automatically create documents when you create new projects through the UI.

## Data Validation Rules

### Client-Side Validation
The application includes client-side validation for:
- Title length (1-200 characters)
- Status must be one of the predefined values
- Priority must be one of the predefined values
- Progress must be between 0-100
- User must be authenticated

### Server-Side Validation
The Firebase Security Rules provide additional validation:
- Ensures userId matches authenticated user
- Validates data structure and types
- Prevents unauthorized access to other users' projects

## Sample Queries

### Get All Projects for Current User
```javascript
import { getProjects } from './services/projectService.js';

// This will automatically filter by the current user's ID
const projects = await getProjects();
```

### Get Projects by Status
```javascript
import { getProjectsByStatus } from './services/projectService.js';

const activeProjects = await getProjectsByStatus('active');
```

### Search Projects
```javascript
import { searchProjects } from './services/projectService.js';

const searchResults = await searchProjects('website redesign');
```

## Performance Considerations

### Best Practices
1. **Use composite indexes** for common query patterns
2. **Limit query results** with pagination for large datasets
3. **Use real-time listeners** for live updates
4. **Cache frequently accessed data** on the client side
5. **Archive old projects** to keep the active collection small

### Query Optimization
- All queries in the project service automatically include `userId` filter
- Use `orderBy` with indexed fields for better performance
- Consider using `limit()` for initial loads and implement infinite scroll

## Backup and Recovery

### Export Data
```bash
# Using Firebase CLI
firebase firestore:export ./backup-folder --project pass-f417f
```

### Import Data
```bash
# Using Firebase CLI
firebase firestore:import ./backup-folder --project pass-f417f
```

## Monitoring and Analytics

### Enable Firestore Usage Monitoring
1. Go to Firebase Console → Your Project → Firestore
2. Check the **Usage** tab to monitor:
   - Document reads/writes
   - Database storage usage
   - Query performance

### Set up Alerts
Configure billing alerts to monitor costs and usage patterns.

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check security rules
   - Ensure user is authenticated
   - Verify userId matches document data

2. **Query Performance Issues**
   - Create missing composite indexes
   - Check Firestore usage dashboard
   - Consider denormalizing data for complex queries

3. **Real-time Updates Not Working**
   - Check subscription setup in project service
   - Verify user permissions
   - Ensure proper cleanup of subscriptions

### Debug Mode
Enable debug logging in development:
```javascript
// Add to your main.js or environment configuration
if (process.env.NODE_ENV === 'development') {
  console.log('Firestore Debug Mode Enabled');
}
```

## Next Steps

1. **Deploy the security rules** to production
2. **Set up monitoring and alerts**
3. **Create backup procedures**
4. **Implement additional features** like:
   - Project templates
   - Team collaboration
   - File attachments
   - Time tracking
   - Integration with other services

## Support Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Community Support](https://stackoverflow.com/questions/tagged/firebase-firestore)

---

**Note**: Remember to switch from test mode to production mode with proper security rules before deploying to production!