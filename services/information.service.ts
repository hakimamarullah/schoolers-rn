import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse, PagedResponse } from "@/types/api.type";
import { InformationSimpleResponse } from "@/types/information.type";

class InformationService {

  async getInformations(page: number, size: number): Promise<PagedResponse<InformationSimpleResponse>> {
    const api = getSecureApiClient();

    const response = await api.get<ApiResponse<PagedResponse<InformationSimpleResponse>>>("/informations", {
      params: {
        page,
        size
      }
    });

    return response.data?.data;
  }

  
  async getInformationById(id: number): Promise<InformationSimpleResponse> {
    const api = getSecureApiClient();

    const response = await api.get<ApiResponse<InformationSimpleResponse>>(`/informations/${id}`);

    return response.data?.data;
  }

  async markAsRead(infoId: number): Promise<void> {
    try {
      const api = getSecureApiClient();
      await api.patch(`/informations/${infoId}/read`);
    } catch(err: any) {
      console.log("Error marking as read", err.message);
    }
  }

  async countUnread(): Promise<number> {
    try {
      const api = getSecureApiClient();
      const response = await api.get<ApiResponse<number>>("/informations/count-unread");
      return response?.data?.data;
    } catch(err: any) {
      console.log("Error get unread count", err);
      return 0;
    }
  }
}

export default new InformationService();