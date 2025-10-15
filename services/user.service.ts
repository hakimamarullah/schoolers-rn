import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse } from "@/types/api.type";

class UserService {

  async updateLocale(locale: string): Promise<string> {
    const api = getSecureApiClient();
    const response = await api.patch<ApiResponse<void>>("/users/locale", { locale });

    return response?.data?.message;
  }
}


export default new UserService();