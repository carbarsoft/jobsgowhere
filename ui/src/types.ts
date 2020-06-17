export interface User {
  first_name: string;
  last_name: string;
  avatar_url: string;
  job_title: string;
  company: string;
}

export interface PostInterface {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  connectedCount: number;
  connectedUser: boolean;
  active: boolean;
  favourite: boolean;
  created_by: User;
}

export type CategoryTypes = "jobs" | "talents";
