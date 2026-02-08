export enum ProjectState {
  Active = 'active',
  Inactive = 'inactive',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  description: string;
  state: ProjectState;
}
