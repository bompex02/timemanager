export enum ProjectState {
    Active = "Aktiv",
    Inactive = "Inaktiv",
    Completed = "Abgeschlossen",
    Cancelled = "Abgebrochen"
}

export class Project {
    id: number;
    name: string;
    description: string;
    state: ProjectState;
    userId: string;

    constructor(id: number, name: string, description: string, state : ProjectState, userId: string) {
        this.id = id,
        this.name = name,
        this.description = description,
        this.state = state,
        this.userId = userId
    }       
}