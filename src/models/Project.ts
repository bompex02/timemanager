export enum ProjectState {
    Active = "Aktiv",
    Inactive = "Inaktiv",
    Completed = "Abgeschlossen",
    Cancelled = "Abgebrochen"
}

export class Project {
    id: number;
    _id?: string // mongoDB ObjectId as string (only set from MongoDB)
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