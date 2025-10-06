import storageService from "./storage.service";

class ConfigService {
  private cachedHost: string | null = null;

  async getApiHost(): Promise<string | null> {
    if (this.cachedHost) {
      return this.cachedHost;
    }

    const storedHost = await storageService.getApiHost();
    this.cachedHost = storedHost;
    return storedHost;
  }

  async setApiHost(host: string): Promise<void> {
    // Remove trailing slash if exists
    const cleanHost = host.replace(/\/$/, '');
    await storageService.setApiHost(host);
    this.cachedHost = cleanHost;
  }

  async clearApiHost(): Promise<void> {
    await storageService.clearApiHost();
    this.cachedHost = null;
  }

  getDefaultHost(): string {
    return this.cachedHost ?? 'http://localhost:8080';
  }

  clearCache(): void {
    this.cachedHost = null;
  }

  getCachedHost(): string | null {
    return this.cachedHost;
  }
}


export default new ConfigService();