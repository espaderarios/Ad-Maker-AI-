import { create } from 'zustand';
import * as projectAPI from '../api/project.api.js';

export const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectAPI.getProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProject: async (title, description) => {
    try {
      const project = await projectAPI.createProject(title, description);
      set((state) => ({
        projects: [project, ...state.projects],
      }));
      return project;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectAPI.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    try {
      const updated = await projectAPI.updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),
}));
