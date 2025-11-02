import { Project, ProjectState } from '../models/Project';
import { DateService } from './DateService';

// base url for the backend API
const BASE_URL = 'http://localhost:3000';

const dateService = DateService.getInstance();

// Singleton class for managing time records
// This class is responsible for making API calls to the backend
export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  // Singleton pattern to ensure only one instance of TimeRecordService exists
  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
        ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

    // add a new Project to the mongodb via the backend API
    async addProject(project: Project): Promise<void> {
        const response = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Hinzufügen eines Projekts');
        }
    }

    // fetch all Projects from the mongodb via the backend API and return them as an array of Project objects
    async getAllProjects(): Promise<Project[]> {
        try {
            const response = await fetch(`${BASE_URL}/projects`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 404) {
                return []; // return an empty array if no projects are found
            }

            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Projekte: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            return data.map((p: any) => ({
                ...p,
                id: p._id,   // Mongo-ID
            }));
        } catch (error) {
            console.error("API Fehler:", error);
            throw new Error("Fehler beim Abrufen der Projekte");
        }
    }

    // fetch a single Project from the mongodb via the backend API and return it as a Project object
    async getProjectById(projectId: string): Promise<Project> {
        try {
            const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 404) {
                throw new Error('Projekt nicht gefunden');
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Fehler beim Abrufen des Projekts:", errorText);
                throw new Error('Fehler beim Abrufen des Projekts');
            }

            const p = await response.json();

            return {
                ...p,
                id: p._id, // Mongo-ID
            };
        } catch (error) {
            console.error("Fehler beim Abrufen des Projekts:", error);
            throw error;
        }
    }

    // fetches all Projects for a specific user from the backend API via userId param
    async getAllProjectsForUser(userId: string): Promise<Project[]> {
        try {
            if (!userId) {
                throw new Error('Fehler beim Abrufen der Projekte: keine UserId angegeben');
            }

            const response = await fetch(`${BASE_URL}/projects/user/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

             // check if the response is empty (404), if so, return an empty array
             if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Projekte: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            return data.map((p: any) => ({
                ...p,
                id: p._id,   // Mongo-ID
            }));
        } catch (error) {
            console.error("API Fehler:", error);
            throw new Error("Fehler beim Abrufen der Projekte");
        }
    }

    // fetches all Projects for a specific user from the backend API via userId param and filters them by state
    async getAllProjectsForUserAndState(userId: string, state: ProjectState): Promise<Project[]> {
        try {
            if (!userId) {
                throw new Error('Fehler beim Abrufen der Projekte: keine UserId angegeben');
            }

            const response = await fetch(`${BASE_URL}/projects/user/${userId}/state/${state}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            // check if the response is empty (404), if so, return an empty array
            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Projekte: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            return data.map((p: any) => ({
                ...p,
                id: p._id,   // Mongo-ID
            }));
        } catch (error) {
            console.error("API Fehler:", error);
            throw new Error("Fehler beim Abrufen der Projekte");
        }
    }

    // update a Project in the mongodb via the backend API
    async updateProject(id: string, updateData: Partial<Project>): Promise<void> {
        const response = await fetch(`${BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });
        if (!response.ok) {
            console.error("Fehler beim Aktualisieren des Projekts:", response.statusText);
            throw new Error('Fehler beim Aktualisieren des Projekts');
        }
    }

    // delete a Project in the mongodb via the backend API
    async deleteProject(projectId: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            console.error("Fehler beim Löschen des Projekts:", response.statusText);
            throw new Error('Fehler beim Löschen des Projekts');
        }
    }

    async getProjectCountForUser(userId: string): Promise<number> {
        try {
            if (!userId) {
                throw new Error('Fehler beim Abrufen der Projektanzahl: keine UserId angegeben');
            }

            const response = await fetch(`${BASE_URL}/projects/user/${userId}/count`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorText = await response.text(); // detailed error message
                throw new Error(`Fehler beim Abrufen der Projektanzahl: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("API Fehler:", error);
            throw new Error("Fehler beim Abrufen der Projektanzahl");
        }
    }
}