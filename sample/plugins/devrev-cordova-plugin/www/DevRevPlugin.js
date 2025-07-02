var exec = require('cordova/exec');

var DevRevPlugin = {
    /**
     * Configures the DevRev SDK with the provided app ID.
     *
     * @param appID - The application ID to configure the SDK.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Configuration
     */
    configure: function(appID, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "configure", [appID]);
    },

    /**
     * Identifies an unverified user after the SDK has been configured.
     *
     * The identification method should be called when you receive a callback or you have your user's data ready.
     *
     * @remarks
     * Make sure that you have called the `configure(appID)` method before.
     *
	 * @param identity - An object containing the user's identity information.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error. 
	 *
	 * @category Identification
	 */
	identifyUnverifiedUser: function(identity, successCallback, errorCallback) {
		exec(successCallback, errorCallback, "DevRevPlugin", "identifyUnverifiedUser", [identity]);
	},

    /**
     * Identifies an anonymous user after the SDK has been configured.
     *
     * The identification method should be called when you receive a callback or you have your user's data ready.
     *
     * @remarks
     * Make sure that you have called the `configure(appID)` method before.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Identification
     */
    identifyAnonymousUser: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "identifyAnonymousUser", []);
    },

    /**
     * Identifies a verified user after the SDK has been configured.
     *
     * The verification process is done between your and DevRev's backend.
     * The identification method should be called when you receive a callback or you have your user's data ready.
     *
     * @remarks
     * Make sure that you have called the `configure(appID)` method before.
     *
	 * @param identity - An object containing the user's identity information.
	 * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     * 
	 * @category Identification
	 */
	identifyVerifiedUser: function(identity, successCallback, errorCallback) {
		exec(successCallback, errorCallback, "DevRevPlugin", "identifyVerifiedUser", [identity]);
    },

	/**
	 * Updates the user information with the provided identity.
	 *
	 * This method should be called to update the user's information after the SDK has been configured.
	 *
	 * @remarks
	 * Make sure that you have called the `configure(appID)` method before.
	 * The `userID` property can *not* be updated.
	 *
	 * @param identity - An object containing the user's identity information.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
	 *
	 * @category Identification
	 */
    updateUser: function(identity, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "DevRevPlugin", "updateUser", [identity]);
    },

    /**
     * Logs out the current identified user and resets the session.
     * The process will also unregister the user's device from receiving push notifications, and stop any ongoing
     * session recording.
     *
     * @param deviceID - A unique device ID. This should be either an identifier **unique** to your system, or the app vendor
     * identifier i.e. Android ID (`Settings.Secure.ANDROID_ID`) for Android and IDFV (`UIDevice.identifierForVendor`) for iOS,
     * or Firebase installation ID.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @see {@link https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor/ UIDevice.identifierForVendor}
     * @see {@link https://developer.android.com/reference/android/provider/Settings.Secure#ANDROID_ID Settings.Secure.ANDROID_ID}
     * @see {@link https://firebase.google.com/docs/projects/manage-installations#monitor-id-lifecycle Firebase installation ID}
     *
     * @category Identification
     */
    logout: function(deviceID, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "logout", [deviceID]);
    },

    /**
     * Starts recording the session.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    startRecording: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "startRecording", []);
    },

    /**
     * Stops recording the session.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    stopRecording: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "stopRecording", []);
    },

    /**
     * Pauses recording the session.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    pauseRecording: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "pauseRecording", []);
    },

    /**
     * Resumes recording the session.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    resumeRecording: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "resumeRecording", []);
    },

    /**
     * Processes all on-demand sessions.
     *
     * This method should be called to process all on-demand sessions.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    processAllOnDemandSessions: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "processAllOnDemandSessions", []);
    },

    /**
     * Adds session properties.
     *
     * @param properties - An object containing the session properties.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    addSessionProperties: function(properties, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "addSessionProperties", [properties]);
    },

    /**
     * Clears session properties.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    clearSessionProperties: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "clearSessionProperties", []);
    },

    /**
     * Marks sensitive views.
     *
     * @param sensitiveViews - An array of sensitive views.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    markSensitiveViews: function(sensitiveViews, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "markSensitiveViews", [sensitiveViews]);
    },

    /**
     * Unmarks sensitive views.
     *
     * @param sensitiveViews - An array of sensitive views.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    unmarkSensitiveViews: function(sensitiveViews, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "unmarkSensitiveViews", [sensitiveViews]);
    },

    /**
     * Starts a timer with the given name and properties.
     *
     * @param name - The name of the timer.
     * @param properties - An object containing the timer properties.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Timer Control
     */
    startTimer: function(name, properties, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "startTimer", [name, properties]);
    },

    /**
     * Ends a timer with the given name and properties.
     *
     * @param name - The name of the timer.
     * @param properties - An object containing the timer properties.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Timer Control
     */
    endTimer: function(name, properties, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "endTimer", [name, properties]);
    },

    /**
     * Resumes all monitoring.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Monitoring
     */
    resumeAllMonitoring: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "resumeAllMonitoring", []);
    },

    /**
     * Stops all monitoring.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Monitoring
     */
    stopAllMonitoring: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "stopAllMonitoring", []);
    },

    /**
     * Gets the session URL for the given platform.
     *
     * @param platform - The platform for which to get the session URL.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Session Management
     */
    sessionURL: function(platform, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "sessionURL", [platform]);
    },

    /**
     * Sets a flag that controls whether the modals should be dismissed after an in-app link is opened.
     *
     * @param value - A flag controlling whether modals are dismissed when opening a link.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category In-app Link Handling
     */
    setShouldDismissModalsOnOpenLink: function(value, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "setShouldDismissModalsOnOpenLink", [value]);
    },

    /**
     * An optional in app links handler for external URLs, deeplinks, etc. in the PLuG support widget.
     *
     * @param handler - The handler function to be called when an in-app link is received.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category In-app Link Handling
     */
	setInAppLinkHandler: function(handler, successCallback, errorCallback) {
		if (typeof handler !== "function") {
			console.error("DevRevPlugin: The handler parameter must be a function!");
			return;
		}

		exec(
			function(response) {
				if (response && response.url) {
					handler(response.url);
				}
				else if (typeof successCallback === "function") {
					successCallback(response);
				}
			},
			errorCallback,
			"DevRevPlugin",
			"setInAppLinkHandler",
			[]
		);
	},

    /**
     * Sets the delegate for the DevRev SDK.
     *
     * @param delegate - The delegate to set.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Configuration
     */
    setDelegate: function(delegate, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "setDelegate", [delegate]);
    },

    /**
     * Presents the support feature modally.
     *
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Support
     */
    showSupport: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "showSupport", []);
    },

    /**
     * Creates a new support conversation and presents it modally.
     *
     * @param isAnimated - A flag denoting whether the process is animated.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Support
     */
    createSupportConversation: function(isAnimated, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "createSupportConversation", [isAnimated]);
    },

    /**
     * Tracks an event with the given name and properties.
     *
     * @param name - The name of the event.
     * @param properties - An object containing the event properties.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Analytics
     */
    trackEvent: function(name, properties, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "trackEvent", [name, properties]);
    },

    /**
     * Registers a device token for push notifications.
     *
     * @param deviceToken - The device token.
     * @param deviceID - The device ID.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Push Notifications
     */
    registerDeviceToken: function(deviceToken, deviceID, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "registerDeviceToken", [deviceToken, deviceID]);
    },

    /**
     * Unregisters a device by its ID.
     *
     * @param deviceID - The ID of the device to unregister.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Push Notifications
     */
    unregisterDevice: function(deviceID, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "unregisterDevice", [deviceID]);
    },

    /**
     * Processes a push notification payload.
     *
     * @param payload - The payload of the push notification.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Push Notifications
     */
    processPushNotification: function(payload, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "processPushNotification", [payload]);
    },

    /**
     * Tracks the screen name.
     *
     * @param screenName - The name of the screen to track.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Tracking
     */
    trackScreenName: function(screenName, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "trackScreenName", [screenName]);
    },

    crash: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "crash", []);
    },

    /**
     * Sets the screen transition state.
     *
     * This method should be called to indicate whether the app is currently in a screen transition.
     * It helps track UI navigation events and ensures that relevant actions are delayed until the transition is complete.
     *
     * @remarks
     * - It is the developer's responsibility to call this method at the appropriate time in the navigation flow.
     * - Set to true when starting a transition, and false when the transition is complete.
     *
     * @param isTransitioning - Boolean indicating whether the app is in a screen transition.
     * @param successCallback - A callback function to be called on success.
     * @param errorCallback - A callback function to be called on error.
     *
     * @category Screen Transition
     */
    setInScreenTransitioning: function(isTransitioning, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DevRevPlugin", "setInScreenTransitioning", [isTransitioning]);
    }
};

module.exports = DevRevPlugin;
