import { getSecureApiClient } from "@/config/apiClient.config";
import { handleResponse } from "@/scripts/utils";
import { ApiResponse } from "@/types/api.type";
import { HomepageInfo } from "@/types/classroom.type";
import { format } from "date-fns";

class HomepageInfoService {
  
    async getHomepageInfo(): Promise<HomepageInfo> {
       const api = getSecureApiClient();
       const response = await api.get<ApiResponse<HomepageInfo>>("/students/homepage", {
        params: {
          date: format(new Date(), "yyyy-MM-dd")
        }
       });
       if (!handleResponse(response.data).ok) {
           throw new Error("Failed to fetch homepage info");
       }
       return response.data?.data;
    }
}

export default new HomepageInfoService();