import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse, PagedResponse } from "@/types/api.type";
import { AssignmentResource, AssignmentResponse, ResourceType } from "@/types/assignments.type";
import storageService from "./storage.service";

class AssignmentService {

  /**
   * Get paginated assignments for students
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   */
  async getAssignments(page: number, size: number): Promise<PagedResponse<AssignmentResponse>> {
      const api = getSecureApiClient();
      const response = await api.get<ApiResponse<PagedResponse<AssignmentResponse>>>(
        `/students/assignments`,
        { params: { page, size } }
      );

    return response.data?.data;
  }

  /**
   * Get assignment details by ID
   * @param assignmentId - The assignment ID
   */
  async getAssignmentDetails(assignmentId: number): Promise<AssignmentResponse> {
    const api = getSecureApiClient();

    const response = await api.get<ApiResponse<AssignmentResponse>>(
      `/students/assignments/${assignmentId}`
    );
  
    const host = await storageService.getApiHost();
    const data = response.data?.data;

    const mapHost = (resource: AssignmentResource): string => {
      return resource.resourceType === ResourceType.FILE ? `${host}${resource.resourcePath}` : resource.resourcePath;
    }
    const mappedResources = data?.resources?.map(it => (
      {
        ...it,
        resourcePath: mapHost(it)
      }
    ))
    
    return {
      ...data,
      resources: mappedResources
    }
  }
}

export default new AssignmentService();