import { Role } from '../models/Role';

// base url for the backend API
const BASE_URL = 'http://localhost:3000';

// Singleton class for managing roles
// This class is responsible for making API calls to the backend
export class RoleService {
    private static instance: RoleService;

    private constructor() {}

    // Singleton pattern to ensure only one instance of RoleService exists
    static getInstance(): RoleService {
        if (!RoleService.instance) {
        RoleService.instance = new RoleService();
        }
        return RoleService.instance;
    }

    // fetch all Roles from the backend API and return them as an array of Role objects
    async getAllRoles(): Promise<Role[]> {
        const response = await fetch(`${BASE_URL}/roles`);

        if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Rollen');
        }

      const data = await response.json();
      return data.map((d: any) => Role.fromDBObject(d));
    }

    // fetch a specific Role by id from the backend API
    async getRoleById(id: string | number): Promise<Role | null> {
      const response = await fetch(`${BASE_URL}/roles/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Rolle');
      }

      const data = await response.json();
      return Role.fromDBObject(data);
    }

    // add a new Role to the backend API
    async addRole(role: Role): Promise<void> {
      const response = await fetch(`${BASE_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role),
      });
  
      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen einer Rolle');
      }
    }

    // delete a Role from the backend API by id
    async deleteRole(roleId: string): Promise<void> {
      const response = await fetch(`${BASE_URL}/roles/${roleId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Fehler beim Löschen der Rolle');
      }
    }

    // update an existing Role in the backend API
    async updateRole(role: Role): Promise<void> {
        const response = await fetch(`${BASE_URL}/roles/${role.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(role),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Rolle');
        }
    }
}