import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse } from "@/types/api.type";
import { ClassroomSchedulesInfo, GetClassroomSessionRequest, SessionInfo, SimpleClassroomInfo } from "@/types/classroom.type";
import storageService from "./storage.service";
import { format } from "date-fns";

class ClassroomService {

  async getClassrooms(): Promise<SimpleClassroomInfo[]> {
    const api = getSecureApiClient();

    const response = await api.get<ApiResponse<SimpleClassroomInfo[]>>("/classrooms");

    return response.data?.data;
  }

  async getClassroomSchedules(classroomId: number): Promise<ApiResponse<ClassroomSchedulesInfo>> {
   const api = getSecureApiClient();
   const response = await api.get<ApiResponse<ClassroomSchedulesInfo>>(`/schedules/classroom/${classroomId}`);
   return response.data;
  }

  async changeClassroom(classroomId: number): Promise<void> {
    const api = getSecureApiClient();
    await api.put(`/students/change-classroom/${classroomId}`);
  }

  async getClassroomOnGoingSession(classroomId: number): Promise<SessionInfo> {
    try {
      const api = getSecureApiClient();

    const request: GetClassroomSessionRequest = {
      classroomId,
      status: "ONGOING",
      sessionDate: format(new Date(), "dd-MM-yyyy")
    }
    const response = await api.post<ApiResponse<SessionInfo>>("/classrooms/sessions", request);

    return response.data?.data;
    } catch(error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): any {
    if (error.response?.data) {
      return error.response?.data;
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export default new ClassroomService();