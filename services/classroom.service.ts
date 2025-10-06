import { getApiClient } from "@/config/apiClient.config";
import { ApiResponse } from "@/types/api.type";
import { SimpleClassroomInfo } from "@/types/classroom.type";

class ClassroomService {

  async getClassrooms(): Promise<SimpleClassroomInfo[]> {
    const api = getApiClient();

    const response = await api.get<ApiResponse<SimpleClassroomInfo[]>>("/classrooms");

    return response.data?.data;
  }
}

export default new ClassroomService();