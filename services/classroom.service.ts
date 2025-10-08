import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse } from "@/types/api.type";
import { ClassroomSchedulesInfo, SimpleClassroomInfo } from "@/types/classroom.type";

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
}

export default new ClassroomService();