export enum ProjectState {
    Active = "Aktiv",
    Inactive = "Inaktiv",
    Completed = "Abgeschlossen",
    Cancelled = "Abgebrochen"
}

export class Project {
    id?: string // mongoDB ObjectId as string (only set from MongoDB)
    name: string;
    description: string;
    state: ProjectState;
    userId: string;

    constructor(name: string, description: string, state : ProjectState, userId: string) {
        this.name = name,
        this.description = description,
        this.state = state,
        this.userId = userId
    }   
    
    // Create a Project instance from a database (MongoDB) document
    static fromDBObject(doc: any): Project {
        const project = new Project(
            doc.name ?? '',
            doc.description ?? '',
            (doc.state ?? ProjectState.Inactive) as ProjectState,
            doc.userId ?? ''
        );
        return project;
    }
}