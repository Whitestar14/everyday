import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Space, Project } from "@/types/app"
import { useTaskStore } from "./tasks"

interface SpaceStore {
  spaces: Space[]
  projects: Project[]
  selectedSpaceId: string | null
  addSpace: (name: string, color?: string) => void
  updateSpace: (id: string, updates: Partial<Space>) => void
  deleteSpace: (id: string) => void
  addProject: (name: string, spaceId: string) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  selectSpace: (id: string | null) => void
  getSpaceProjects: (spaceId: string) => Project[]
}

export const useSpaceStore = create<SpaceStore>()(
  persist(
    (set, get) => ({
      spaces: [],
      projects: [],
      selectedSpaceId: null,

      addSpace: (name: string, color: string = "#e5e7eb") => {
        const newSpace: Space = {
          id: crypto.randomUUID(),
          name: name.trim(),
          color,
          createdAt: new Date(),
        }
        set((state) => ({
          spaces: [...state.spaces, newSpace],
        }))
      },

      updateSpace: (id: string, updates: Partial<Space>) => {
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === id ? { ...space, ...updates } : space
          ),
        }))
      },

      deleteSpace: (id: string) => {
        // Move tasks to inbox (set spaceId to undefined)
        const taskStore = useTaskStore.getState()
        taskStore.tasks
          .filter((task) => task.spaceId === id)
          .forEach((task) => taskStore.moveTaskToSpace(task.id, undefined as any))
        // Remove space and its projects
        set((state) => ({
          spaces: state.spaces.filter((space) => space.id !== id),
          projects: state.projects.filter((project) => project.spaceId !== id),
          selectedSpaceId: state.selectedSpaceId === id ? null : state.selectedSpaceId,
        }))
      },

      addProject: (name: string, spaceId: string) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name: name.trim(),
          spaceId,
          createdAt: new Date(),
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project
          ),
        }))
      },

      deleteProject: (id: string) => {
        // Keep tasks in space (set projectId to undefined)
        const taskStore = useTaskStore.getState()
        taskStore.tasks
          .filter((task) => task.projectId === id)
          .forEach((task) => taskStore.moveTaskToProject(task.id, undefined as any))
        // Remove project
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }))
      },

      selectSpace: (id: string | null) => {
        set({ selectedSpaceId: id })
      },

      getSpaceProjects: (spaceId: string) => {
        return get().projects.filter((project) => project.spaceId === spaceId)
      },
    }),
    {
      name: "everyday-spaces",
      partialize: (state) => ({
        spaces: state.spaces,
        projects: state.projects,
        selectedSpaceId: state.selectedSpaceId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          state.spaces = state.spaces.map((space: Space & { createdAt: string | Date }) => ({
            ...space,
            createdAt: new Date(space.createdAt),
          }))
          state.projects = state.projects.map((project: Project & { createdAt: string | Date }) => ({
            ...project,
            createdAt: new Date(project.createdAt),
          }))
        }
      },
    }
  )
)