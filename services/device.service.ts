import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { DeviceType } from '@/types/auth.type';

class DeviceService {

  async getDeviceId(): Promise<string> {
    if (Platform.OS === 'ios') {
      return Application.getIosIdForVendorAsync().then((id) => id || 'unknown-ios');
    } else {
      return Application.getAndroidId() || 'unknown-android';
    }
  }

  async getDeviceIdAsync(): Promise<string> {
    if (Platform.OS === 'ios') {
      const id = await Application.getIosIdForVendorAsync();
      return id || 'unknown-ios';
    } else {
      return Application.getAndroidId() || 'unknown-android';
    }
  }

  getDeviceName(): string {
    const modelName = Device.modelName || Device.deviceName || 'Unknown Device';
    const osName = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const osVersion = Device.osVersion || '';
    return `${modelName} (${osName} ${osVersion})`;
  }

  getDeviceType(): DeviceType {
    const deviceType = Device.deviceType;
    
    if (deviceType === Device.DeviceType.TABLET) {
      return DeviceType.TABLET;
    }
    
    return DeviceType.MOBILE;
  }

  async getDeviceInfo() {
    const deviceId = await this.getDeviceIdAsync();
    
    return {
      deviceId,
      deviceName: this.getDeviceName(),
      deviceType: this.getDeviceType(),
      platform: Platform.OS,
      osVersion: Device.osVersion || 'Unknown',
    };
  }
}

export default new DeviceService();