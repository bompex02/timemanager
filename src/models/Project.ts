export enum ProjectState {
    Active = "Aktiv",
    Inactive = "Inaktiv",
    Completed = "Abgeschlossen",
    Cancelled = "Abgebrochen"
}

export class Project {
    id?: string; // mongoDB ObjectId as string (only set from MongoDB)
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

    // compares the current Project instance with an updated Project instance and returns the changed fields
    public getProjectChanges(updated: Project): Partial<Project> {
      const changes: Partial<Project> = {};

      if (this.name !== updated.name) changes.name = updated.name;
      if (this.description !== updated.description) changes.description = updated.description;
      if (this.state !== updated.state) changes.state = updated.state;

      return changes;
    }
    
   public static getProjectStateColorClass(state: ProjectState): string {
    switch (state) {
      case ProjectState.Active:
        return 'bg-green-500 text-white';
      case ProjectState.Inactive:
        return 'bg-yellow-500 text-white';
      case ProjectState.Completed:
        return 'bg-blue-500 text-white';
      case ProjectState.Cancelled:
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

    public static getProjectStateHoverColorClass(state: ProjectState): string {
    switch (state) {
      case ProjectState.Active:
        return 'hover:bg-green-600';
      case ProjectState.Inactive:
        return 'hover:bg-yellow-600';
      case ProjectState.Completed:
        return 'hover:bg-blue-600';
      case ProjectState.Cancelled:
        return 'hover:bg-red-600';
      default:
        return 'hover:bg-gray-600';
    }
  }
}