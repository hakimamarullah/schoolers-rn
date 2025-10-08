
class SessionService {
  private static instance: SessionService;
  private signOutCallback: (() => void) | null = null;

  static getInstance() {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  setSignOutCallback(callback: () => void) {
    this.signOutCallback = callback;
  }

  async signOut() {
    if (this.signOutCallback) {
      this.signOutCallback();
    }
  }
}

export default SessionService.getInstance();