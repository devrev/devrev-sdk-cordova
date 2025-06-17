#import <Cordova/CDVPlugin.h>

@interface DevRevSDKCordovaPlugin : CDVPlugin

#pragma mark - Configuration

- (void)configure:(CDVInvokedUrlCommand*)command;

#pragma mark - Identification

- (void)identifyUnverifiedUser:(CDVInvokedUrlCommand*)command;
- (void)identifyAnonymousUser:(CDVInvokedUrlCommand*)command;
- (void)identifyVerifiedUser:(CDVInvokedUrlCommand*)command;
- (void)updateUser:(CDVInvokedUrlCommand*)command;
- (void)logout:(CDVInvokedUrlCommand*)command;

#pragma mark - Support

- (void)showSupport:(CDVInvokedUrlCommand*)command;
- (void)createSupportConversation:(CDVInvokedUrlCommand*)command;

#pragma mark - Analytics

- (void)trackEvent:(CDVInvokedUrlCommand*)command;

#pragma mark - User recording

- (void)startRecording:(CDVInvokedUrlCommand*)command;
- (void)stopRecording:(CDVInvokedUrlCommand*)command;
- (void)pauseRecording:(CDVInvokedUrlCommand*)command;
- (void)resumeRecording:(CDVInvokedUrlCommand*)command;
- (void)processAllOnDemandSessions:(CDVInvokedUrlCommand*)command;

#pragma mark - Session properties

- (void)addSessionProperties:(CDVInvokedUrlCommand*)command;
- (void)clearSessionProperties:(CDVInvokedUrlCommand*)command;

#pragma mark - Sensitive field masking

- (void)markSensitiveViews:(CDVInvokedUrlCommand*)command;
- (void)unmarkSensitiveViews:(CDVInvokedUrlCommand*)command;

#pragma mark - Timer control

- (void)startTimer:(CDVInvokedUrlCommand*)command;
- (void)endTimer:(CDVInvokedUrlCommand*)command;

#pragma mark - Session monitoring control

- (void)resumeAllMonitoring:(CDVInvokedUrlCommand*)command;
- (void)stopAllMonitoring:(CDVInvokedUrlCommand*)command;

#pragma mark - In-app Link Handling

- (void)setShouldDismissModalsOnOpenLink:(CDVInvokedUrlCommand*)command;
- (void)setInAppLinkHandler:(CDVInvokedUrlCommand*)command;

#pragma mark - Screen identification

- (void)trackScreenName:(CDVInvokedUrlCommand*)command;

#pragma mark - Push notifications

- (void)registerDeviceToken:(CDVInvokedUrlCommand*)command;
- (void)unregisterDevice:(CDVInvokedUrlCommand*)command;
- (void)processPushNotification:(CDVInvokedUrlCommand*)command;

#pragma mark - Crash
- (void)crash:(CDVInvokedUrlCommand*)command;

@end
