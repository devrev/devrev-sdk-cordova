# DevRev SDK for Cordova
DevRev SDK, used for integrating DevRev services into your Cordova app.

## Table of contents
- [DevRev SDK for Cordova](#devrev-sdk-for-cordova)
  - [Table of contents](#table-of-contents)
  - [Quickstart guide](#quickstart-guide)
    - [Requirements](#requirements)
    - [Installation](#installation)
    - [Set up the DevRev SDK](#set-up-the-devrev-sdk)
  - [Features](#features)
    - [Identification](#identification)
      - [Anonymous identification](#anonymous-identification)
      - [Unverified identification](#unverified-identification)
      - [Verified identification](#verified-identification)
        - [Generate an AAT](#generate-an-aat)
        - [Exchange your AAT for a session token](#exchange-your-aat-for-a-session-token)
        - [Identifying the verified user](#identifying-the-verified-user)
      - [Updating the user](#updating-the-user)
      - [Logout](#logout)
    - [PLuG support chat](#plug-support-chat)
      - [Creating a new support conversation](#creating-a-new-support-conversation)
    - [In-app link handling](#in-app-link-handling)
      - [In-app link callback](#in-app-link-callback)
    - [Analytics](#analytics)
    - [Session analytics](#session-analytics)
      - [Opting-in or out](#opting-in-or-out)
      - [Session recording](#session-recording)
      - [Session properties](#session-properties)
      - [Masking sensitive data](#masking-sensitive-data)
        - [Example (masked element):](#example-masked-element)
        - [Example (unmasked element):](#example-unmasked-element)
      - [Timers](#timers)
      - [Screen tracking](#screen-tracking)
      - [Screen transition tracking (Android only)](#screen-transition-tracking-android-only)
    - [Push notifications](#push-notifications)
      - [Configuration](#configuration)
      - [Register for push notifications](#register-for-push-notifications)
      - [Unregister from push notifications](#unregister-from-push-notifications)
      - [Processing push notification](#processing-push-notification)
        - [Android](#android)
          - [Example](#example)
        - [iOS](#ios)
          - [Example](#example-1)
  - [Sample app](#sample-app)
  - [Troubleshooting](#troubleshooting)
  - [Migration guide](#migration-guide)

## Quickstart guide
### Requirements
- Cordova 12.0 or later.
- On Android, the minimum API level should be 24.
- On iOS, the minimum deployment target should be 15.0.

### Installation
To install the DevRev SDK, run the following command:

```sh
cordova plugin add @devrev/sdk-cordova
```

### Set up the DevRev SDK
1. Open the DevRev web app at [https://app.devrev.ai](https://app.devrev.ai) and go to the **Settings** page.
2. Under **PLuG settings** copy the value under **Your unique App ID**.
3. After obtaining the credentials, you can configure the DevRev SDK in your app.

The SDK will be ready for use once you execute the following configuration method.

```javascript
DevRev.configure(appID, successCallback, errorCallback)
```

## Features
### Identification
To access certain features of the DevRev SDK, user identification is required.

The identification function should be placed appropriately in your app after the user logs in. If you have the user information available at app launch, call the function after the `DevRev.configure(appID:)` method.

> [!IMPORTANT]
> On iOS, if you haven't previously identified the user, the DevRev SDK will automatically create an anonymous user for you immediately after the SDK is configured.

> [!IMPORTANT]
> The `Identity` structure allows for custom fields in the user, organization, and account traits. These fields must be configured through the DevRev app before they can be used. For more information, refer to [Object customization](https://devrev.ai/docs/product/object-customization).

You can select from the following methods to identify users within your application:

#### Anonymous identification
The anonymous identification method allows you to create an anonymous user with an optional user identifier, ensuring that no other data is stored or associated with the user.

```javascript
DevRev.identifyAnonymousUser(successCallback, errorCallback)
```

#### Unverified identification
The unverified identification method identifies users with a unique identifier, but it does not verify their identity with the DevRev backend.

```javascript
DevRev.identifyUnverifiedUser(identity, successCallback, errorCallback)
```

#### Verified identification
The verified identification method is used to identify users with an identifier unique to your system within the DevRev platform. The verification is done through a token exchange process between you and the DevRev backend.

The steps to identify a verified user are as follows:
1. Generate an AAT for your system (preferably through your backend).
2. Exchange your AAT for a session token for each user of your system.
3. Pass the user identifier and the exchanged session token to the `DevRev.identifyVerifiedUser(userID, sessionToken, successCallback, errorCallback)` method.

> [!CAUTION]
> For security reasons we **strongly recommend** that the token exchange is executed on your backend to prevent exposing your application access token (AAT).

##### Generate an AAT
1. Open the DevRev web app at [https://app.devrev.ai](https://app.devrev.ai) and go to the **Settings** page.
2. Open the **PLuG Tokens** page.
3. Under the **Application access tokens** panel, click **New token** and copy the token that's displayed.

> [!IMPORTANT]
> Ensure that you copy the generated application access token, as you cannot view it again.

##### Exchange your AAT for a session token
In order to proceed with identifying the user, you need to exchange your AAT for a session token. This step will help you identify a user of your own system within the DevRev platform.

Here is a simple example of an API request to the DevRev backend to exchange your AAT for a session token:
> [!CAUTION]
> Make sure that you replace the `<AAT>` and `<YOUR_USER_ID>` with the actual values.
```bash
curl \
--location 'https://api.devrev.ai/auth-tokens.create' \
--header 'accept: application/json, text/plain, */*' \
--header 'content-type: application/json' \
--header 'authorization: <AAT>' \
--data '{
  "rev_info": {
    "user_ref": "<YOUR_USER_ID>"
  }
}'
```

The response of the API call will contain a session token that you can use with the verified identification method in your app.

> [!NOTE]
> As a good practice, **your** app should retrieve the exchanged session token from **your** backend at app launch or any relevant app lifecycle event.

##### Identifying the verified user
Pass the user identifier and the exchanged session token to the verified identification method:

```javascript
DevRev.identifyVerifiedUser(userID, sessionToken, successCallback, errorCallback)
```

#### Updating the user
You can update the user's information using the following method:

```javascript
DevRev.updateUser(identity, successCallback, errorCallback)
```

> [!IMPORTANT]
> The `userID` property cannot be updated.

#### Logout
You can logout of the current user by using the following method:

```javascript
DevRev.logout(deviceID, successCallback, errorCallback)
```

The user will be logged out by clearing their credentials, as well as unregistering the device from receiving push notifications, and stopping the session recording.


### PLuG support chat
Once user identification is complete, you can start using the chat (conversations) dialog supported by our DevRev SDK. The support chat feature can be shown as a modal screen from the top-most screen.

> [!IMPORTANT]
> This feature requires the SDK to be configured and the user to be identified, whether they are unverified or anonymous.

```javascript
DevRev.showSupport(successCallback, errorCallback)
```

#### Creating a new support conversation
You can initiate a new support conversation directly from your app. This method displays the support chat screen and simultaneously creates a new conversation.

```javascript
DevRev.createSupportConversation(isAnimated, successCallback, errorCallback)
```

### In-app link handling
In certain cases, tapping links in the support chat opens them in the app instead of a browser. You can control whether the chat modal screen is dismissed after the link is opened by calling the following method:

```javascript
DevRevSDK.setShouldDismissModalsOnOpenLink(value, successCallback, errorCallback)
```

Setting this flag to true applies the system's default behavior for opening links, which includes dismissing any DevRev modal screens to facilitate handling your own deep links.

#### In-app link callback
> [!NOTE]
> This feature is for Android only.

For scenarios where custom handling is needed, links from the support chat can be captured with the following method:

```javascript
DevRevSDK.setInAppLinkHandler(handler, successCallback, errorCallback)
```

### Analytics
> [!IMPORTANT]
> This feature requires the SDK to be configured and the user to be identified, whether they are unverified or anonymous.

The DevRev SDK allows you to send custom analytic events by using a properties map. You can track these events using the following function:

```javascript
DevRev.trackEvent(name, properties, successCallback, errorCallback)
```

### Session analytics
The DevRev SDK offers session analytics features to help you understand how users interact with your app.

#### Opting-in or out
Session analytics features are opted-in by default, enabling them from the start. However, you can opt-out using the following method:

```javascript
DevRev.stopAllMonitoring(successCallback, errorCallback)
```

To opt back in, use the following method:

```javascript
DevRev.resumeAllMonitoring(successCallback, errorCallback)
```

#### Session recording
You can enable session recording to record user interactions with your app.

> [!CAUTION]
> The session recording feature is opt-out and is enabled by default.

The session recording feature includes the following methods to control the recording:

- `DevRev.startRecording(successCallback, errorCallback)`: Starts the session recording.
- `DevRev.stopRecording(successCallback, errorCallback)`: Stops the session recording and upload it to the portal.
- `DevRev.pauseRecording(successCallback, errorCallback)`: Pauses the ongoing session recording.
- `DevRev.resumeRecording(successCallback, errorCallback)`: Resumes a paused session recording.
- `DevRev.processAllOnDemandSessions(successCallback, errorCallback)`: Stops the ongoing session recording and upload all offline sessions on demand, including the current one.

#### Session properties
You can add custom properties to the session recording to help you understand the context of the session. The properties are defined as a map of string values.

```javascript
DevRev.addSessionProperties(properties, successCallback, errorCallback)
```

To clear the session properties in scenarios such as user logout or when the session ends, use the following method:

```javascript
DevRev.clearSessionProperties(successCallback, errorCallback)
```

#### Masking sensitive data
To protect sensitive data, the DevRev SDK provides an auto-masking feature that masks data before sending to the server. Input views such as text fields, text views, and web views are automatically masked.

While the auto-masking mechanism might be sufficient for most cases, to explicitly mask any WebView element on a webpage, use the CSS class `devrev-mask`. This ensures that sensitive elements, such as confidential text, remain hidden.

##### Example (masked element):
```html
<label class="ue-mask">Foo: Bar</label>
```

If any previously masked views need to be unmasked, you can use the following method:

##### Example (unmasked element):
```html
<input type="text" placeholder="Enter Foo" name="foo" required class="ue-unmask">
```

#### Timers
The DevRev SDK offers a timer mechanism to measure the time spent on specific tasks, allowing you to track events such as response time, loading time, or any other duration-based metrics.

The mechanism uses balanced start and stop methods, both of which accept a timer name and an optional dictionary of properties.

To start a timer, use the following method:

```javascript
DevRev.startTimer(name, properties, successCallback, errorCallback)
```

To stop a timer, use the following method:

```javascript
DevRev.endTimer(name, properties, successCallback, errorCallback)
```

#### Screen tracking
The DevRev SDK offers automatic screen tracking to help you understand how users navigate through your app. Although view controllers are automatically tracked, you can manually track screens using the following method:

```javascript
DevRev.trackScreenName(screenName, successCallback, errorCallback)
```

#### Screen transition tracking (Android only)
On Android, the DevRev SDK provides methods to manually track the screen transitions.

When a screen transition begins, you must call the following method:

```javascript
DevRev.setInScreenTransitioning(true, successCallback, errorCallback)
```

When a screen transition ends, you must call the following method:

```javascript
DevRev.setInScreenTransitioning(false, successCallback, errorCallback)
```

### Push notifications
You can configure your app to receive push notifications from the DevRev SDK. The SDK is able to handle push notifications and execute actions based on the notification's content.

The DevRev backend sends push notifications to your app to notify users about new messages in the PLuG support chat.

#### Configuration
To receive push notifications, you need to configure your DevRev organization by following the instructions in the [push notifications](https://developer.devrev.ai/public/sdks/mobile/push-notification) section.

#### Register for push notifications
> [!IMPORTANT]
> To ensure delivery to the correct user, push notifications require that the SDK has been configured and the user has been identified.

The DevRev SDK offers a method to register your device for receiving push notifications. You can register for push notifications using the following method:

```javascript
DevRev.registerDeviceToken(deviceToken, deviceID, successCallback, errorCallback)
```

On Android devices, the `deviceToken` must be the Firebase Cloud Messaging (FCM) token value. On iOS devices, it must be the Apple Push Notification Service (APNs) token.

#### Unregister from push notifications
If your app no longer needs to receive push notifications, you can unregister the device.

Use the following method to unregister the device:

```javascript
DevRev.unregisterDevice(deviceID, successCallback, errorCallback)
```

The method requires the device identifier, which should be the same as the one used when registering the device.

#### Processing push notification
##### Android
On Android, notifications are implemented as data messages to offer flexibility. However, this means that automatic click processing isn't available. To handle notification clicks, developers need to intercept the click event, extract the payload, and pass it to a designated method for processing. This custom approach enables tailored notification handling in Android applications.

To process the notification, use the following method:

```javascript
DevRev.processPushNotification(payload, successCallback, errorCallback)
```
Here, the `message` object from the notification payload needs to be passed to this function.

###### Example

```javascript
const notificationPayload = {
    "message": {
        "title": "New Message",
        "body": "You have received a new message.",
        "data": {
            "messageId": "12345",
            "sender": "John Doe"
        }
    }
};

const messageJson = notificationPayload["message"];

DevRev.processPushNotification(messageJson, function() {
    console.log("Push notification processed successfully.");
}, function(error) {
    console.error("Failed to process push notification:", error);
});
```

##### iOS
On iOS devices, you must pass the received push notification payload to the DevRev SDK for processing. The SDK will then handle the notification and execute the necessary actions.

```javascript
DevRev.processPushNotification(payload, successCallback, errorCallback)
```

###### Example

```javascript
const notificationPayload = {
    "message": {
        "title": "New Message",
        "body": "You have received a new message.",
        "data": {
            "messageId": "12345",
            "sender": "John Doe"
        }
    }
};

const messageJson = notificationPayload["message"];

DevRev.processPushNotification(messageJson, function() {
    console.log("Push notification processed successfully.");
}, function(error) {
    console.error("Failed to process push notification:", error);
});
```

## Sample app
A sample app with use cases for the DevRev Cordova plugin has been provided as a part of our [public repository](https://github.com/devrev/devrev-sdk-cordova). To set up and run the sample app:

```sh
cd sample
npm install
cordova platform add android
cordova platform add ios
```

- **On Android:**
  ```sh
  cordova run android
  ```
  OR open `platforms/android` in Android Studio and run the app.

- **On iOS:**
1. Open `platforms/ios/Podfile` and ensure it contains:
   ```ruby
   platform :ios, '15.0'
   ```
2. Install dependencies:
   ```sh
   cd platforms/ios
   pod install
   ```
3. Run the app:
   ```sh
     cordova run ios
   ```
   OR open `DevRevSDKSample.xcworkspace` in Xcode and run the app.

## Troubleshooting
- **Issue**: Support chat won't show.
	**Solution**: Ensure you have correctly called one of the identification methods: `DevRev.identifyUnverifiedUser(...)`, `DevRev.identifyVerifiedUser(...)`, or `DevRev.identifyAnonymousUser(...)`.

- **Issue**: Not receiving push notifications.
	**Solution**: Ensure that your app is configured to receive push notifications and that your device is registered with the DevRev SDK.

## Migration guide
If you are migrating from the legacy UserExperior SDK to the new DevRev SDK, please refer to the [Migration Guide](./MIGRATION.md) for detailed instructions and feature equivalence.
