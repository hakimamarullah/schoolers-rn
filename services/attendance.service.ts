import { getSecureApiClient } from "@/config/apiClient.config";
import { ApiResponse, AttendanceResponse, ClockInRequest } from "@/types/api.type";
import storageService from "./storage.service";
import i18n from "@/i18n/i18n";
import { handleError } from "@/scripts/utils";

class AttendanceService {
 
  async clockIn(sessionId: number, lat: string, lon: string): Promise<ApiResponse<AttendanceResponse>> {
     try {
      const api = getSecureApiClient();
     const  userInfo = await storageService.getUserInfo();
     
     if (!userInfo) {
      throw new Error(i18n.t("common.noUserInfoFound"))
     }
     const request: ClockInRequest = {
      sessionId,
      loginId: userInfo.loginId,
      latitude: lat,
      longitude: lon
     }

     const response = await api.post<ApiResponse<AttendanceResponse>>("/attendance/clock-in", request);

     return response?.data;
     } catch(error: any) {
      return handleError(error);
     }
  }

}

export default new AttendanceService();