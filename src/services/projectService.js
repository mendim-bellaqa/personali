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
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from './firebase.js';

/**
 * Project Service - Firebase Firestore operations for projects
 * Handles all CRUD operations for project management
 */

// Firestore collection reference
const projectsCollection = collection(db, 'projects');

/**
 * Create a new project
 * @param {Object} projectData - Project data object
 * @returns {Promise<string>} - Returns the document ID of the created project
 */
export const createProject = async (projectData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const project = {
      ...projectData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      tasks: [], // Array of task IDs
      status: projectData.status || 'active',
      progress: projectData.progress || 0,
      priority: projectData.priority || 'medium'
    };

    const docRef = await addDoc(projectsCollection, project);
    console.log('Project created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Get all projects for the current user
 * @returns {Promise<Array>} - Array of project objects
 */
export const getProjects = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      projectsCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const projects = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project document ID
 * @returns {Promise<Object|null>} - Project object or null if not found
 */
export const getProject = async (projectId) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {string} projectId - Project document ID
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<void>}
 */
export const updateProject = async (projectId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const projectRef = doc(db, 'projects', projectId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    await updateDoc(projectRef, updateData);
    console.log('Project updated successfully');
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId - Project document ID
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await deleteDoc(doc(db, 'projects', projectId));
    console.log('Project deleted successfully');
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

/**
 * Add a task to a project
 * @param {string} projectId - Project document ID
 * @param {string} taskId - Task document ID
 * @returns {Promise<void>}
 */
export const addTaskToProject = async (projectId, taskId) => {
  try {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');

    const tasks = project.tasks || [];
    if (!tasks.includes(taskId)) {
      tasks.push(taskId);
      await updateProject(projectId, { tasks });
    }
  } catch (error) {
    console.error('Error adding task to project:', error);
    throw error;
  }
};

/**
 * Remove a task from a project
 * @param {string} projectId - Project document ID
 * @param {string} taskId - Task document ID to remove
 * @returns {Promise<void>}
 */
export const removeTaskFromProject = async (projectId, taskId) => {
  try {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');

    const tasks = project.tasks || [];
    const updatedTasks = tasks.filter(id => id !== taskId);
    await updateProject(projectId, { tasks: updatedTasks });
  } catch (error) {
    console.error('Error removing task from project:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time project updates
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToProjects = (callback) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const q = query(
      projectsCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const projects = [];
      querySnapshot.forEach((doc) => {
        projects.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(projects);
    });
  } catch (error) {
    console.error('Error setting up project subscription:', error);
    throw error;
  }
};

/**
 * Get projects by status
 * @param {string} status - Project status filter
 * @returns {Promise<Array>} - Filtered array of projects
 */
export const getProjectsByStatus = async (status) => {
  try {
    const projects = await getProjects();
    return projects.filter(project => project.status === status);
  } catch (error) {
    console.error('Error filtering projects by status:', error);
    throw error;
  }
};

/**
 * Search projects by title or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching projects
 */
export const searchProjects = async (searchTerm) => {
  try {
    const projects = await getProjects();
    const term = searchTerm.toLowerCase();
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(term) ||
      project.description?.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching projects:', error);
    throw error;
  }
};

/**
 * Update project progress
 * @param {string} projectId - Project document ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Promise<void>}
 */
export const updateProjectProgress = async (projectId, progress) => {
  try {
    await updateProject(projectId, { progress: Math.max(0, Math.min(100, progress)) });
  } catch (error) {
    console.error('Error updating project progress:', error);
    throw error;
  }
};

// Export all functions
export default {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addTaskToProject,
  removeTaskFromProject,
  subscribeToProjects,
  getProjectsByStatus,
  searchProjects,
  updateProjectProgress
};