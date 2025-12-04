export enum RoleType { // Ab mit dir ins Backend (DB Table anlegen!)
    ADMIN = 'admin',
    //MANAGER = 'manager',
    USER = 'user',
    //GUEST = 'guest',
}

export interface Permission {
    id: string;
    name: string;
    description: string;
}

export class Role {
    id: string;
    name: RoleType;
    description: string;
    permissions: Permission[];

    constructor(
        id: string,
        name: RoleType,
        description: string,
        permissions: Permission[] = []
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }

    addPermission(permission: Permission): void {
        if (!this.permissions.find(p => p.id === permission.id)) {
            this.permissions.push(permission);
        }
    }

    removePermission(permissionId: string): void {
        this.permissions = this.permissions.filter(p => p.id !== permissionId);
    }

    hasPermission(permissionId: string): boolean {
        return this.permissions.some(p => p.id === permissionId);
    }

    // Create a Role instance from a database (MongoDB) document
    static fromDBObject(doc: any): Role {
        const id = String(doc._id ?? doc.id ?? '');
        const name = (doc.name ?? doc.role ?? '') as RoleType;
        const description = doc.description ?? '';
        const permissions: Permission[] = (doc.permissions ?? []).map((p: any) => ({
            id: String(p._id ?? p.id ?? ''),
            name: p.name ?? '',
            description: p.description ?? '',
        }));

        return new Role(id, name, description, permissions);
    }

}