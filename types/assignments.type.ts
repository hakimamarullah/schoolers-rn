export interface AssignmentResponse {
  id: number;
  parentAssignmentId: number;
  title: string;
  dueDate: string;
  subjectName: string;
  remainingTimeBadgeText: string;
  badgeColor: string;
  description: string;
  status: string;
  isSubmitted: boolean;
  resources: AssignmentResource[]
}

export interface AssignmentResource {
  id: number;
  resourceType: ResourceType;
  resourceName: string;
  resourcePath: string;
}

export enum ResourceType {
  FILE = "FILE", URL = "URL"
}