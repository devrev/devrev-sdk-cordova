package ai.devrev.sdk.bridge.cordova

enum class Method(val methodName: String) {
    // Configuration
    CONFIGURE("configure"),

    // Identification
    IDENTIFY_UNVERIFIED_USER("identifyUnverifiedUser"),
    IDENTIFY_VERIFIED_USER("identifyVerifiedUser"),
    IDENTIFY_ANONYMOUS_USER("identifyAnonymousUser"),
    UPDATE_USER("updateUser"),
    LOGOUT("logout"),

    // Support
    SHOW_SUPPORT("showSupport"),
    CREATE_SUPPORT_CONVERSATION("createSupportConversation"),

    // Analytics
    TRACK_EVENT("trackEvent"),

    // Session Recording
    START_RECORDING("startRecording"),
    STOP_RECORDING("stopRecording"),
    PAUSE_RECORDING("pauseRecording"),
    RESUME_RECORDING("resumeRecording"),
    PROCESS_ALL_ON_DEMAND_SESSION("processAllOnDemandSessions"),

    // Session Properties
    ADD_SESSION_PROPERTIES("addSessionProperties"),
    CLEAR_SESSION_PROPERTIES("clearSessionProperties"),

    // Timer Control
    START_TIMER("startTimer"),
    END_TIMER("endTimer"),

    // Screen Transition
    SET_IN_SCREEN_TRANSITIONING("setInScreenTransitioning"),

    // Monitoring
    RESUME_ALL_MONITORING("resumeAllMonitoring"),
    STOP_ALL_MONITORING("stopAllMonitoring"),

    // User Session URL
    GET_SESSION_URL("sessionURL"),

    // In-app Link Handling
    SET_IN_APP_LINK_HANDLER("setInAppLinkHandler"),
    SET_SHOULD_DISMISS_MODALS_ON_OPEN_LINK("setShouldDismissModalsOnOpenLink"),

    // Screen Identification
    TRACK_SCREEN_NAME("trackScreenName"),

    // Push Notifications
    REGISTER_DEVICE_TOKEN("registerDeviceToken"),
    UNREGISTER_DEVICE("unregisterDevice"),
    PROCESS_PUSH_NOTIFICATION("processPushNotification"),
    SET_CUSTOM_KEY("setCustomKey"),

    // Crash
    CRASH("crash");

    companion object {
        private val METHOD_MAP = values().associateBy(Method::methodName)

        fun getMethod(methodName: String): Method? {
            return METHOD_MAP[methodName]
        }
    }
}
