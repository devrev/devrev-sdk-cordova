#import "DevRevSDKCordovaPlugin.h"
#import <DevRevSDK/DevRevSDK.h>

@implementation DevRevSDKCordovaPlugin

static NSString *const DRInvalidArgumentErrorMessage = @"Invalid argument";
static NSString *inAppLinkHandlerId;

- (id)safeArgumentAtIndex:(NSUInteger)index fromCommand:(CDVInvokedUrlCommand *)command {
	if (command.arguments.count <= index || ![command.arguments objectAtIndex:index]) {
		return nil;
	}
	return [command.arguments objectAtIndex:index];
}

#pragma mark - Configuration

- (void)configure:(CDVInvokedUrlCommand *)command {
	NSString *appID = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (!appID) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev configureWithAppID:appID];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Identification

- (void)identifyUnverifiedUser:(CDVInvokedUrlCommand *)command {
	NSDictionary *identityDict = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (![identityDict isKindOfClass:[NSDictionary class]]) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	NSString *userID = identityDict[@"userID"];
	if (![userID isKindOfClass:[NSString class]]) {
		userID = nil;
	}

	NSString *organizationID = identityDict[@"organizationID"];
	if (![organizationID isKindOfClass:[NSString class]]) {
		organizationID = nil;
	}

	NSString *accountID = identityDict[@"accountID"];
	if (![accountID isKindOfClass:[NSString class]]) {
		accountID = nil;
	}

	NSDictionary *userTraitsDict = identityDict[@"userTraits"];
	UserTraits *userTraits = nil;
	if ([userTraitsDict isKindOfClass:[NSDictionary class]]) {
		userTraits = [[UserTraits alloc] initWithDisplayName:userTraitsDict[@"displayName"]
													   email:userTraitsDict[@"email"]
													fullName:userTraitsDict[@"fullName"]
											 userDescription:userTraitsDict[@"description"]
												phoneNumbers:userTraitsDict[@"phoneNumbers"]
												customFields:userTraitsDict[@"customFields"]];
	}

	NSDictionary *orgTraitsDict = identityDict[@"organizationTraits"];
	OrganizationTraits *organizationTraits = nil;
	if ([orgTraitsDict isKindOfClass:[NSDictionary class]]) {
		organizationTraits = [[OrganizationTraits alloc] initWithDisplayName:orgTraitsDict[@"displayName"]
																	  domain:orgTraitsDict[@"domain"]
													 organizationDescription:orgTraitsDict[@"description"]
																phoneNumbers:orgTraitsDict[@"phoneNumbers"]
																		tier:orgTraitsDict[@"tier"]
																customFields:orgTraitsDict[@"customFields"]];
	}

	NSDictionary *accountTraitsDict = identityDict[@"accountTraits"];
	AccountTraits *accountTraits = nil;
	if ([accountTraitsDict isKindOfClass:[NSDictionary class]]) {
		accountTraits = [[AccountTraits alloc] initWithDisplayName:accountTraitsDict[@"displayName"]
														   domains:accountTraitsDict[@"domains"]
												accountDescription:accountTraitsDict[@"description"]
													  phoneNumbers:accountTraitsDict[@"phoneNumbers"]
														  websites:accountTraitsDict[@"websites"]
															  tier:accountTraitsDict[@"tier"]
													  customFields:accountTraitsDict[@"customFields"]];
	}

	Identity *identity = [[Identity alloc] initWithUserID:userID
										   organizationID:organizationID
												accountID:accountID
											   userTraits:userTraits
									   organizationTraits:organizationTraits
											accountTraits:accountTraits];
	[DevRev identifyUnverifiedUser:identity];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)identifyVerifiedUser:(CDVInvokedUrlCommand *)command {
	NSString *userID = [self safeArgumentAtIndex:0 fromCommand:command];
	NSString *sessionToken = [self safeArgumentAtIndex:1 fromCommand:command];
	CDVPluginResult *result;

	if (!userID || !sessionToken) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev identifyVerifiedUser:userID sesionToken:sessionToken];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)identifyAnonymousUser:(CDVInvokedUrlCommand *)command {
	NSString *userID = [[NSUUID UUID] UUIDString];
	[DevRev identifyAnonymousUser:userID];
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)updateUser:(CDVInvokedUrlCommand *)command {
	NSDictionary *identityDict = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (![identityDict isKindOfClass:[NSDictionary class]]) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	NSString *userID = identityDict[@"userID"];
	if (![userID isKindOfClass:[NSString class]]) {
		userID = nil;
	}

	NSString *organizationID = identityDict[@"organizationID"];
	if (![organizationID isKindOfClass:[NSString class]]) {
		organizationID = nil;
	}

	NSString *accountID = identityDict[@"accountID"];
	if (![accountID isKindOfClass:[NSString class]]) {
		accountID = nil;
	}

	NSDictionary *userTraitsDict = identityDict[@"userTraits"];
	UserTraits *userTraits = nil;
	if ([userTraitsDict isKindOfClass:[NSDictionary class]]) {
		userTraits = [[UserTraits alloc] initWithDisplayName:userTraitsDict[@"displayName"]
													   email:userTraitsDict[@"email"]
													fullName:userTraitsDict[@"fullName"]
											 userDescription:userTraitsDict[@"description"]
												phoneNumbers:userTraitsDict[@"phoneNumbers"]
												customFields:userTraitsDict[@"customFields"]];
	}

	NSDictionary *orgTraitsDict = identityDict[@"organizationTraits"];
	OrganizationTraits *organizationTraits = nil;
	if ([orgTraitsDict isKindOfClass:[NSDictionary class]]) {
		organizationTraits = [[OrganizationTraits alloc] initWithDisplayName:orgTraitsDict[@"displayName"]
																	  domain:orgTraitsDict[@"domain"]
													 organizationDescription:orgTraitsDict[@"description"]
																phoneNumbers:orgTraitsDict[@"phoneNumbers"]
																		tier:orgTraitsDict[@"tier"]
																customFields:orgTraitsDict[@"customFields"]];
	}

	NSDictionary *accountTraitsDict = identityDict[@"accountTraits"];
	AccountTraits *accountTraits = nil;
	if ([accountTraitsDict isKindOfClass:[NSDictionary class]]) {
		accountTraits = [[AccountTraits alloc] initWithDisplayName:accountTraitsDict[@"displayName"]
														   domains:accountTraitsDict[@"domains"]
												accountDescription:accountTraitsDict[@"description"]
													  phoneNumbers:accountTraitsDict[@"phoneNumbers"]
														  websites:accountTraitsDict[@"websites"]
															  tier:accountTraitsDict[@"tier"]
													  customFields:accountTraitsDict[@"customFields"]];
	}

	Identity *identity = [[Identity alloc] initWithUserID:userID
										   organizationID:organizationID
												accountID:accountID
											   userTraits:userTraits
									   organizationTraits:organizationTraits
											accountTraits:accountTraits];
	[DevRev updateUserWithIdentity:identity];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)logout:(CDVInvokedUrlCommand *)command {
	NSString *deviceID = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (!deviceID) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev logoutWithDeviceID:deviceID];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Support

- (void)showSupport:(CDVInvokedUrlCommand *)command {
	dispatch_async(dispatch_get_main_queue(), ^{
		[DevRev showSupport:YES];
	});
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)createSupportConversation:(CDVInvokedUrlCommand *)command {
	BOOL isAnimated = YES;
	NSNumber *isAnimatedArg = [self safeArgumentAtIndex:0 fromCommand:command];

	if (isAnimatedArg && [isAnimatedArg isKindOfClass:[NSNumber class]]) {
		isAnimated = [isAnimatedArg boolValue];
	}

	[DevRev createSupportConversation:isAnimated];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - Analytics

- (void)trackEvent:(CDVInvokedUrlCommand *)command {
	NSString *name = [self safeArgumentAtIndex:0 fromCommand:command];
	NSDictionary *properties = [self safeArgumentAtIndex:1 fromCommand:command];
	CDVPluginResult *result;

	if (!name || !properties) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev trackEventWithName:name properties:properties];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - User Recording

- (void)startRecording:(CDVInvokedUrlCommand *)command {
	[DevRev startRecording];
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)stopRecording:(CDVInvokedUrlCommand *)command {
	[DevRev stopRecording];
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)pauseRecording:(CDVInvokedUrlCommand *)command {
	[DevRev pauseRecording];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)resumeRecording:(CDVInvokedUrlCommand *)command {
	[DevRev resumeRecording];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)processAllOnDemandSessions:(CDVInvokedUrlCommand *)command {
	[DevRev processAllOnDemandSessions];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - Session monitoring controls

- (void)resumeAllMonitoring:(CDVInvokedUrlCommand *)command {
	[DevRev resumeAllMonitoring];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)stopAllMonitoring:(CDVInvokedUrlCommand *)command {
	[DevRev stopAllMonitoring];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - In-app Link Handling

- (void)setShouldDismissModalsOnOpenLink:(CDVInvokedUrlCommand *)command {
    NSNumber *shouldDismissModalsOnOpenLink = [self safeArgumentAtIndex:0 fromCommand:command];
    CDVPluginResult *result;

    if (![shouldDismissModalsOnOpenLink isKindOfClass:[NSNumber class]]) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }

    [DevRev setShouldDismissModalsOnOpenLink:[shouldDismissModalsOnOpenLink boolValue]];
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)setInAppLinkHandler:(CDVInvokedUrlCommand *)command {
	inAppLinkHandlerId = command.callbackId;
	CDVPluginResult *pluginResult;

	if (!inAppLinkHandlerId) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Failed to set in-app link handler"];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}

	[DevRev setInAppLinkHandler:^(NSURL *url) {
		[self sendInAppLinkHandlerWithURL:url];
	}];

	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[pluginResult setKeepCallbackAsBool:YES];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)sendInAppLinkHandlerWithURL:(NSURL *)url {
	if (inAppLinkHandlerId) {
		NSDictionary *response = @{@"url": url.absoluteString};
		CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:response];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:inAppLinkHandlerId];
	}
}

#pragma mark - Session Properties

- (void)addSessionProperties:(CDVInvokedUrlCommand *)command {
	NSDictionary *properties = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (!properties) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev addSessionProperties:properties];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)clearSessionProperties:(CDVInvokedUrlCommand *)command {
	[DevRev clearSessionProperties];
	CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Sensitive field masking

- (void)markSensitiveViews:(CDVInvokedUrlCommand *)command {
	NSArray *sensitiveViews = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *pluginResult;

	if (!sensitiveViews) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		return;
	}

	[DevRev markSensitiveViews:sensitiveViews];
	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)unmarkSensitiveViews:(CDVInvokedUrlCommand *)command {
	NSArray *sensitiveViews = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *pluginResult;

	if (!sensitiveViews) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		return;
	}

	[DevRev unmarkSensitiveViews:sensitiveViews];
	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - Timer Control

- (void)startTimer:(CDVInvokedUrlCommand *)command {
	NSString *name = [self safeArgumentAtIndex:0 fromCommand:command];
	NSDictionary *properties = [self safeArgumentAtIndex:1 fromCommand:command];
	CDVPluginResult *result;

	if (!name || !properties) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev startTimerWithName:name properties:properties];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)endTimer:(CDVInvokedUrlCommand *)command {
	NSString *name = [self safeArgumentAtIndex:0 fromCommand:command];
	NSDictionary *properties = [self safeArgumentAtIndex:1 fromCommand:command];
	CDVPluginResult *result;

	if (!name || !properties) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev endTimerWithName:name properties:properties];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Push Notifications

- (void)registerDeviceToken:(CDVInvokedUrlCommand *)command {
	NSString *deviceToken = [self safeArgumentAtIndex:0 fromCommand:command];
	NSString *deviceID = [self safeArgumentAtIndex:1 fromCommand:command];
	CDVPluginResult *result;

	if (!deviceToken && !deviceID) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev registerDeviceToken:deviceToken forDeviceID:deviceID];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)unregisterDevice:(CDVInvokedUrlCommand *)command {
	NSString *deviceID = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *pluginResult;

	if (!deviceID) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		return;
	}

	[DevRev unregisterDeviceWithID:deviceID];
	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)processPushNotification:(CDVInvokedUrlCommand *)command {
	NSString *payload = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *result;

	if (!payload) {
		result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
		return;
	}

	[DevRev processPushNotification:payload];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

#pragma mark - Screen Identification

- (void)trackScreenName:(CDVInvokedUrlCommand *)command {
	NSString *screenName = [self safeArgumentAtIndex:0 fromCommand:command];
	CDVPluginResult *pluginResult;

	if (!screenName) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:DRInvalidArgumentErrorMessage];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		return;
	}

	[DevRev trackScreenWithName:screenName];
	pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)crash:(CDVInvokedUrlCommand*)command {
	@[][1];
}


@end
