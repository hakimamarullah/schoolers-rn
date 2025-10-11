import { getSecureApiClient } from "@/config/apiClient.config";
import { handleError } from "@/scripts/utils";
import { ApiResponse } from "@/types/api.type";
import { ClassroomSchedulesInfo, GetClassroomSessionRequest, SessionInfo, SimpleClassroomInfo } from "@/types/classroom.type";
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

  async getClassroomOnGoingSession(classroomId: number): Promise<ApiResponse<SessionInfo>> {
    try {
      const api = getSecureApiClient();

    const request: GetClassroomSessionRequest = {
      classroomId,
      status: "ONGOING",
      sessionDate: format(new Date(), "dd-MM-yyyy")
    }
    const response = await api.post<ApiResponse<SessionInfo>>("/classrooms/sessions", request);

    return response.data;
    } catch(error: any) {
      return handleError(error);
    }
  }

}

export default new ClassroomService();