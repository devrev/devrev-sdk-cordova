# Migration Guide
This guide and chart should help facilitate the transition from the legacy UserExperior SDK to the new DevRev SDK in your Cordova application, providing insights into feature equivalents and method changes.

## Feature Equivalence Chart

| Feature | UserExperior SDK | DevRev SDK |
|-|-|-|
| Installation | `cordova plugin add userexperior-cordova-plugin@<version>` | `cordova plugin add @devrev/sdk-cordova@<version>` |
| Initialization | `UserExperior.startRecording(appID)` | `DevRev.configure(appID, successCallback, errorCallback)` |
| User Identification | `UserExperior.setUserIdentifier(userIdentifier)` | `DevRev.identifyAnonymousUser(userID, successCallback, errorCallback)`<br> `DevRev.identifyUnverifiedUser(identity, successCallback, errorCallback)`<br> `DevRev.identifyVerifiedUser(userID, sessionToken, successCallback, errorCallback)`<br> `DevRev.updateUser(identity, successCallback, errorCallback)`<br> `DevRev.logout(deviceID, successCallback, errorCallback)` |
| Event Tracking | `UserExperior.logEvent(name)` | `DevRev.trackEvent(name, properties, successCallback, errorCallback)` |
| Session Recording | `UserExperior.stopRecording()`<br />`UserExperior.pauseRecording()`<br />`UserExperior.resumeRecording()` | `DevRev.startRecording(successCallback, errorCallback)`<br />`DevRev.stopRecording(successCallback, errorCallback)`<br />`DevRev.pauseRecording(successCallback, errorCallback)`<br />`DevRev.resumeRecording(successCallback, errorCallback)`<br />`DevRev.processAllOnDemandSessions(successCallback, errorCallback)` |
| Opting-in or out | `UserExperior.optOut()`<br> `UserExperior.optIn()`<br> `UserExperior.getOptOutStatus()` | `DevRev.stopAllMonitoring(successCallback, errorCallback)`<br> `DevRev.resumeAllMonitoring(successCallback, errorCallback)` |
| Session Properties | `UserExperior.setUserProperties(userProperties)` | `DevRev.addSessionProperties(properties, successCallback, errorCallback)`<br />`DevRev.clearSessionProperties()` |
| Masking Sensitive Data | `<input type="text" placeholder="Enter Username" name="username" required class="ue-mask">`<br />`<input type="text" placeholder="Enter Username" name="username" required class="ue-unmask">` | `<input type="text" placeholder="Enter Username" name="username" required class="devrev-mask">`<br />`<input type="text" placeholder="Enter Username" name="username" required class="devrev-unmask">` |
| Timers | `UserExperior.startTimer(timerName, properties)`<br> `UserExperior.endTimer(timerName, properties)` | `DevRev.startTimer(name, properties)`<br> `DevRev.endTimer(name, properties)` |
| PLuG support chat | Not supported. | `DevRev.showSupport(successCallback, errorCallback)`<br> `DevRev.createSupportConversation(successCallback, errorCallback)`<br> `DevRev.setShouldDismissModalsOnOpenLink(value, successCallback, errorCallback)`<br> `DevRevSDK.setInAppLinkHandler(handler, successCallback, errorCallback)` |
| Push Notifications | Not supported. | `DevRev.registerDeviceToken(deviceToken, deviceID, successCallback, errorCallback)`<br> `DevRev.unregisterDevice(deviceID, successCallback, errorCallback)`<br>`DevRev.processPushNotification(payload, successCallback, errorCallback)` |
