function getClientMetadata() {
  return {
    version: "1",
    originUrl: window.location.href,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now()
  };
}
export {
  getClientMetadata
};
//# sourceMappingURL=utils.js.map
