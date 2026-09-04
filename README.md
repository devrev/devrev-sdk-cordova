# DevRev SDK for Cordova
DevRev SDK, used for integrating DevRev services into your Cordova app.

- [DevRev SDK for Cordova](#devrev-sdk-for-cordova)
  - [Quickstart guide](#quickstart-guide)
    - [Requirements](#requirements)
    - [Installation](#installation)
    - [Set up the DevRev SDK](#set-up-the-devrev-sdk)
      - [Update the feature configuration](#update-the-feature-configuration)
      - [Feature configuration reference](#feature-configuration-reference)
        - [Support widget theme options](#support-widget-theme-options)
  - [Features](#features)
    - [Identification](#identification)
      - [Identify an unverified user](#identify-an-unverified-user)
      - [Identify a verified user](#identify-a-verified-user)
        - [Generate an AAT](#generate-an-aat)
        - [Exchange your AAT for a session token](#exchange-your-aat-for-a-session-token)
        - [Identify the verified user](#identify-the-verified-user)
      - [Update the user](#update-the-user)
      - [Logout](#logout)
      - [Identity model](#identity-model)
        - [Properties](#properties)
          - [User traits](#user-traits)
          - [Organization traits](#organization-traits)
          - [Account traits](#account-traits)
    - [Support chat](#support-chat)
      - [Create a new support conversation](#create-a-new-support-conversation)
    - [In-app link handling](#in-app-link-handling)
    - [Dynamic theme configuration](#dynamic-theme-configuration)
    - [Analytics](#analytics)
    - [Session analytics](#session-analytics)
      - [Opt in or out](#opt-in-or-out)
      - [Session recording](#session-recording)
      - [Session properties](#session-properties)
      - [Mask sensitive data](#mask-sensitive-data)
      - [Timers](#timers)
      - [User interaction tracking](#user-interaction-tracking)
      - [Capture errors](#capture-errors)
      - [Track screens](#track-screens)
      - [Manage screen transitions (Android only)](#manage-screen-transitions-android-only)
    - [Push notifications](#push-notifications)
      - [Configuration](#configuration)
      - [Register for push notifications](#register-for-push-notifications)
      - [Unregister from push notifications](#unregister-from-push-notifications)
      - [Handle push notifications](#handle-push-notifications)
        - [Android](#android)
        - [iOS](#ios)
  - [Sample app](#sample-app)
    - [Firebase configuration](#firebase-configuration)
      - [Push notifications](#push-notifications-1)
        - [Android](#android-1)
        - [iOS](#ios-1)
      - [Running the app](#running-the-app)
        - [Android](#android-2)
        - [iOS](#ios-2)
  - [Troubleshooting](#troubleshooting)
    - [ProGuard (Android only)](#proguard-android-only)
  - [Migration guide](#migration-guide)

## Quickstart guide

This guide helps you integrate the DevRev SDK into your Cordova app.

### Requirements

- Cordova 12.0 or later.
- Android: minimum API level 24.
- iOS: minimum deployment target 15.0.
- Recommended: an SSH key configured locally and registered with [GitHub](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh).

### Installation

To install the DevRev SDK, run the following command:

```sh
cordova plugin add @devrev/sdk-cordova
```

### Set up the DevRev SDK

1. Open the DevRev web app at [https://app.devrev.ai](https://app.devrev.ai) and go to the **Settings** page.
2. Under **PLuG settings**, copy the value under **Your unique App ID**.
3. Configure the DevRev SDK in your app using the obtained credentials.

> [!WARNING]
> The DevRev SDK must be configured before you can use any of its features.

The SDK becomes ready for use once the configuration API is executed.

```javascript
DevRev.configure(appID, successCallback, errorCallback)
```

To provide a feature configuration during setup, call the overload that accepts it:

```javascript
DevRev.configure(appID, featureConfiguration, successCallback, errorCallback)
```

For default behavior, call the simpler form:

```javascript
DevRev.configure(appID, function() {
    console.log('DevRev SDK configured successfully.');
}, function(error) {
    console.error('Failed to configure DevRev SDK:', error);
});
```

To customize behavior such as frame capture, auto-start recording, or theme preferences, pass a full `FeatureConfiguration` object:

```javascript
DevRev.configure(appID, {
    enableFrameCapture: false,
    autoStartRecording: false,
    prefersDialogMode: false,
    alwaysUseRemoteConfig: true,
    supportWidgetTheme: {
        prefersSystemTheme: true,
    },
}, function() {
    console.log('DevRev SDK configured with FeatureConfiguration.');
}, function(error) {
    console.error('Failed to configure DevRev SDK:', error);
});
```

#### Update the feature configuration

You can adjust the feature configuration without reconfiguring the SDK. Pass a **full** `FeatureConfiguration` object (all properties are required):

```javascript
DevRev.updateFeatureConfiguration({
    enableFrameCapture: true,
    autoStartRecording: true,
    prefersDialogMode: false,
    alwaysUseRemoteConfig: true,
    supportWidgetTheme: {
        prefersSystemTheme: true,
    },
}, function() {
    console.log('Feature configuration updated.');
}, function(error) {
    console.error('Failed to update feature configuration:', error);
});
```

#### Feature configuration reference

`FeatureConfiguration` controls how the SDK behaves both during initial setup and when calling `DevRev.updateFeatureConfiguration(...)`. All properties are required when providing a feature configuration.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableFrameCapture` | `boolean` | `true` | Enables the screen capture pipeline used by session replay. |
| `autoStartRecording` | `boolean` | `true` | Automatically starts recording after the SDK finishes remote configuration. |
| `prefersDialogMode` | `boolean` | `false` | Prefer dialog mode for the support UI (Android only). |
| `alwaysUseRemoteConfig` | `boolean` | `true` | Always use remote config. |
| `supportWidgetTheme` | `SupportWidgetTheme` | — | Controls the appearance of the in-app support widget, including dynamic theme behavior. |

##### Support widget theme options

`SupportWidgetTheme` lets you fine-tune the support UI. Use the `supportWidgetTheme` property inside your feature configuration.

```javascript
var customTheme = {
    prefersSystemTheme: false,
    primaryTextColor: '#1F2933',
    accentColor: '#F97316',
    spacing: {
        bottom: '20px',
        side: '16px'
    }
};
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `prefersSystemTheme` | `boolean` | `true` | Follows the device appearance when `true`; otherwise uses your custom colors. |
| `primaryTextColor` | `string?` | — | Hex color string (e.g. `'#000000'`, `'#1F2933'`) for primary text in the support widget. |
| `accentColor` | `string?` | — | Hex color string (e.g. `'#F97316'`, `'#FF0000'`) applied to buttons and highlights. |
| `spacing` | `{ [key: string]: string }?` | — | CSS-like spacing overrides (`bottom` and `side` keys are recognized). |

## Features

### Identification

To access certain features of the DevRev SDK, user identification is required.

The identification function should be placed appropriately in your app after the user logs in. If you have the user information available at app launch, call the function after the `DevRev.configure(appID)` method.

> [!TIP]
> If you haven't previously identified the user, the DevRev SDK will automatically create an anonymous user for you immediately after the SDK is configured.

> [!TIP]
> The `Identity` structure allows for custom fields in the user, organization, and account traits. These fields must be configured through the DevRev app before they can be utilized. For more information, refer to [Object customization](https://devrev.ai/docs/product/object-customization).

You can select from the following methods to identify users within your application:

#### Identify an unverified user

The unverified identification method identifies users with a unique identifier, but it does not verify their identity with the DevRev backend.

```javascript
DevRev.identifyUnverifiedUser(identity, successCallback, errorCallback)
```

#### Identify a verified user

The verified identification method is used to identify users with an identifier unique to your system within the DevRev platform. The verification is done through a token exchange process between you and the DevRev backend.

The steps to identify a verified user are as follows:
1. Generate an AAT for your system (preferably through your backend).
2. Exchange your AAT for a session token for each user of your system.
3. Pass the user identifier and the exchanged session token to the `DevRev.identifyVerifiedUser(_:sessionToken:)` method.

> [!WARNING]
> For security reasons, it is **strongly recommended** that the token exchange is executed on your backend to prevent exposing your application access token (AAT).

##### Generate an AAT

1. Open the DevRev web app at [https://app.devrev.ai](https://app.devrev.ai) and go to the **Settings** page.
2. Open the **PLuG Tokens** page.
3. Under the **Application access tokens** panel, click **New token** and copy the token that's displayed.

> [!WARNING]
> Ensure that you copy the generated application access token, as you cannot view it again.

##### Exchange your AAT for a session token

To proceed with identifying the user, you need to exchange your AAT for a session token. This step helps you identify a user of your own system within the DevRev platform.

Here is a simple example of an API request to the DevRev backend to exchange your AAT for a session token:

> [!WARNING]
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

The response of the API call contains a session token that you can use with the verified identification method in your app.

> [!WARNING]
> As a good practice, **your** app should retrieve the exchanged session token from **your** backend at app launch or any relevant app lifecycle event.

##### Identify the verified user

Pass the user identifier and the exchanged session token to the verified identification method:

```javascript
DevRev.identifyVerifiedUser(userID, sessionToken, successCallback, errorCallback)
```

#### Update the user

You can update the user's information using the following method:

```javascript
DevRev.updateUser(identity, successCallback, errorCallback)
```

> [!WARNING]
> The `userID` property cannot be updated.

#### Logout

You can log out the current user by using the following method:

```javascript
DevRev.logout(deviceID, successCallback, errorCallback)
```

The user is logged out by clearing their credentials, as well as unregistering the device from receiving push notifications, and stopping the session recording.

#### Identity model

The `Identity` interface is used to provide user, organization, and account information when identifying users or updating their details. This class is used primarily with the `identifyUnverifiedUser` and `updateUser` methods.

##### Properties

The `Identity` class contains the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `userRef` | `string` | ✅ | A unique identifier for the user |
| `organizationRef` | `string OR null` | ❌ | An identifier for the user's organization |
| `accountRef` | `string OR null` | ❌ | An identifier for the user's account |
| `userTraits` | `UserTraits OR null` | ❌ | Additional information about the user |
| `organizationTraits` | `OrganizationTraits OR null` | ❌ | Additional information about the organization |
| `accountTraits` | `AccountTraits OR null` | ❌ | Additional information about the account |

> [!NOTE]
> The custom fields properties defined as part of the user, organization and account traits, must be configured in the DevRev web app **before** they can be used. See [Object customization](https://devrev.ai/docs/product/object-customization) for more information.

###### User traits

The `UserTraits` class contains detailed information about the user:

> [!NOTE]
> All properties in `UserTraits` are optional.

| Property | Type | Description |
|----------|------|-------------|
| `displayName` | `string OR null` | The displayed name of the user |
| `email` | `string OR null` | The user's email address |
| `fullName` | `string OR null` | The user's full name |
| `description` | `string OR null` | A description of the user |
| `customFields` | `{ [key: string]: any }` | Dictionary of custom fields configured in DevRev |

###### Organization traits

The `OrganizationTraits` class contains detailed information about the organization:

> [!NOTE]
> All properties in `OrganizationTraits` are optional.

| Property | Type | Description |
|----------|------|-------------|
| `displayName` | `string OR null` | The displayed name of the organization |
| `domain` | `string OR null` | The organization's domain |
| `description` | `string OR null` | A description of the organization |
| `phoneNumbers` | `string[] OR null` | Array of the organization's phone numbers |
| `tier` | `string OR null` | The organization's tier or plan level |
| `customFields` | `{ [key: string]: any }` | Dictionary of custom fields configured in DevRev |

###### Account traits

The `AccountTraits` class contains detailed information about the account:

> [!NOTE]
> All properties in `AccountTraits` are optional.

| Property | Type | Description |
|----------|------|-------------|
| `displayName` | `string OR null` | The displayed name of the account |
| `domains` | `string[] OR null` | Array of domains associated with the account |
| `description` | `string OR null` | A description of the account |
| `phoneNumbers` | `string[] OR null` | Array of the account's phone numbers |
| `websites` | `string[] OR null` | Array of websites associated with the account |
| `tier` | `string OR null` | The account's tier or plan level |
| `customFields` | `{ [key: string]: any }` | Dictionary of custom fields configured in DevRev |

### Support chat

Once user identification is complete, you can start using the chat (conversations) dialog supported by our DevRev SDK. The support chat feature can be shown as a modal screen from the top-most screen.

To show the support chat screen in your app, you can use the following method:

```javascript
DevRev.showSupport(successCallback, errorCallback)
```

#### Create a new support conversation

You can initiate a new support conversation directly from your app. This method displays the support chat screen and simultaneously creates a new conversation.

```javascript
DevRev.createSupportConversation(successCallback, errorCallback)
```

You can optionally pass a plain-text message to pre-fill the conversation input field:

```javascript
DevRev.createSupportConversation('I need help with billing for order #12345', successCallback, errorCallback)
```

### In-app link handling

The DevRev SDK provides a mechanism to handle links opened from within any screen that is part of the DevRev SDK.

You can fully customize the link handling behavior by setting the specialized in-app link handler. That way you can decide what should happen when a link is opened from within the app.

```javascript
DevRev.setInAppLinkHandler(handler, successCallback, errorCallback)
```

You can further customize the behavior by setting the `setShouldDismissModalsOnOpenLink` boolean flag. This flag controls whether the DevRev SDK should dismiss the top-most modal screen when a link is opened.

```javascript
DevRev.setShouldDismissModalsOnOpenLink(value, successCallback, errorCallback)
```

### Dynamic theme configuration

The DevRev SDK allows you to configure the theme dynamically based on the system appearance, or use the theme configured on the DevRev portal. By default, the theme is dynamic and follows the system appearance.

```javascript
DevRev.setPrefersSystemTheme(value, successCallback, errorCallback)
```

### Analytics

The DevRev SDK allows you to send custom analytic events by using a properties map. You can track these events using the following function:

```javascript
DevRev.trackEvent(name, properties, successCallback, errorCallback)
```

### Session analytics

The DevRev SDK offers session analytics features to help you understand how users interact with your app.

#### Opt in or out

Session analytics features are opted-in by default, enabling them from the start. However, you can opt-out using the following method:

```javascript
DevRev.stopAllMonitoring(successCallback, errorCallback)
```

To opt back in, use the following method:

```javascript
DevRev.resumeAllMonitoring(successCallback, errorCallback)
```

#### Session recording

You can enable session recording to capture user interactions with your app.

> [!NOTE]
> The session recording feature is opt-out and is enabled by default.

The session recording feature includes the following methods to control the recording:

| Method                                                               | Action                                                    |
|--------------------------------------------------------------------|-----------------------------------------------------------|
|`DevRev.startRecording(successCallback, errorCallback)`   | Starts the session recording.                             |
|`DevRev.stopRecording(successCallback, errorCallback)`    | Ends the session recording and uploads it to the portal. |
|`DevRev.pauseRecording(successCallback, errorCallback)`   | Pauses the ongoing session recording.                     |
|`DevRev.resumeRecording(successCallback, errorCallback)`  | Resumes a paused session recording.                       |
|`DevRev.processAllOnDemandSessions(successCallback, errorCallback)`  | Stops the ongoing user recording and sends all on-demand sessions along with the current recording. |

#### Session properties

You can add custom properties to the session recording to help you understand the context of the session. The properties are defined as a map of string values.

```javascript
DevRev.addSessionProperties(properties, successCallback, errorCallback)
```

To clear the session properties in scenarios such as user logout or when the session ends, use the following method:

```javascript
DevRev.clearSessionProperties(successCallback, errorCallback)
```

#### Mask sensitive data

To protect sensitive data, the DevRev SDK provides an auto-masking feature that masks data before sending to the server. Input views such as password text fields are automatically masked.

While the auto-masking feature is sufficient for most situations, you can manually mark/unmark additional views as sensitive.

To mark elements as sensitive inside a web view (`WebView`), apply the `devrev-mask` CSS class. To unmark them, use `devrev-unmask`.

- Mark an element as masked:
  ```html
  <label class="devrev-mask">OTP: 12345</label>
  ```
- Mark an element as unmasked:
  ```html
  <input type="text" placeholder="Enter Username" name="username" required class="devrev-unmask">
  ```

#### Timers

The DevRev SDK offers a timer mechanism to measure the time spent on specific tasks, allowing you to track events such as response time, loading time, or any other duration-based metrics.

The mechanism works using balanced start and stop methods that both accept a timer name and an optional dictionary of properties.

To start a timer, use the following method:

```javascript
DevRev.startTimer(name, properties, successCallback, errorCallback)
```

To stop a timer, use the following method:

```javascript
DevRev.endTimer(name, properties, successCallback, errorCallback)
```

#### User interaction tracking

The DevRev SDK automatically tracks user interactions such as taps, swipes, and scrolls. However, in some cases you may want to disable this tracking to prevent sensitive user actions from being recorded.

To **temporarily disable** user interaction tracking, use the following method:

```javascript
DevRev.pauseUserInteractionTracking(successCallback, errorCallback)
```

To **resume** user interaction tracking, use the following method:

```javascript
DevRev.resumeUserInteractionTracking(successCallback, errorCallback)
```

#### Capture errors

You can report a handled error from a catch block using the `captureError` function.

This ensures that even if the error is handled in your app, it will still be logged for diagnostics.

```javascript
DevRev.captureError(
    error,
    tag
)
```

**Example:**

```javascript
try {
} catch (e) {
    DevRev.captureError(
        e,
        'network-failure'
    );
}
```

**Example with Error:**

```javascript
try {
    throw new Error('Something went wrong');
} catch (e) {
    DevRev.captureError(e, 'custom-error');
}
```

#### Track screens

The DevRev SDK offers automatic screen tracking to help you understand how users navigate through your app. Although screens are automatically tracked, you can manually track screens using the following method:

```javascript
DevRev.trackScreenName(name, successCallback, errorCallback)
```

#### Manage screen transitions (Android only)

The DevRev SDK allows tracking of screen transitions to understand the user navigation within your app.
You can manually update the state using the following methods:

```javascript
// Mark the transition as started.
DevRev.setInScreenTransitioning(true, successCallback, errorCallback)

// Mark the transition as ended.
DevRev.setInScreenTransitioning(false, successCallback, errorCallback)
```

### Push notifications

You can configure your app to receive push notifications from the DevRev SDK. The SDK is designed to handle push notifications and execute actions based on the notification's content.

The DevRev backend sends push notifications to your app to alert users about new messages in the support chat.

#### Configuration

To receive push notifications, you need to configure your DevRev organization by following the instructions in the [push notifications](https://developer.devrev.ai/sdks/mobile/push-notifications) section.

#### Register for push notifications

> [!NOTE]
> Push notifications require SDK configuration and user identification, whether unverified or verified, to ensure delivery to the correct user.

The DevRev SDK offers a method to register your device for receiving push notifications. You can register for push notifications using the following method:

```javascript
DevRev.registerDeviceToken(deviceToken, deviceID, successCallback, errorCallback)
```

On Android devices, the `deviceToken` should be the Firebase Cloud Messaging (FCM) token value, while on iOS devices, it should be the Apple Push Notification service (APNs) token.

#### Unregister from push notifications

If your app no longer needs to receive push notifications, you can unregister the device.

Use the following method to unregister the device:

```javascript
DevRev.unregisterDevice(deviceID, successCallback, errorCallback)
```

#### Handle push notifications

##### Android

On Android, notifications are implemented as data messages to offer flexibility. However, this means that automatic click processing isn't available. To handle notification clicks, developers need to intercept the click event, extract the payload, and pass it to a designated method for processing. This custom approach enables tailored notification handling in Android applications.

To process the notification, use the following method:

```javascript
DevRev.processPushNotification(payload, successCallback, errorCallback)
```

Here, the `message` object from the notification payload should be passed to this function.

For example:

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

On iOS devices, you must update the `AppDelegate` to intercept notification clicks and forward the payload to the SDK.

In `didFinishLaunchingWithOptions`, set the `UNUserNotificationCenter` delegate:

```swift
UNUserNotificationCenter.current().delegate = self
```

Implement `userNotificationCenter(_:didReceive:)` to pass the notification payload to the SDK:

```swift
func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse
) async {
    await DevRev.processPushNotification(
        response.notification.request.content.userInfo
    )
}
```

For example:

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
A sample app with use cases for the DevRev Cordova plugin is provided as part of our [public repository](https://github.com/devrev/devrev-sdk-cordova). To set up and run the sample app:

```sh
cd sample
npm install
cordova platform add android
cordova platform add ios
```

### Firebase configuration
To enable push notifications in the sample app, you need to set up your Firebase project and replace the provided dummy configuration files for both Android and iOS.

#### Push notifications

##### Android

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Add an Android app (if not already added). Ensure the **Package Name** matches your Cordova app ID.
4. Go to **Project Settings** and download the `google-services.json` file.
5. Replace the `samples/google-services.json` file with the downloaded file.

##### iOS

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Add an iOS app (if not already added). Ensure the **Bundle ID** matches your Cordova app ID.
4. Go to **Project Settings** and download the `GoogleService-Info.plist` file.
5. Replace the `samples/GoogleService-Info.plist` file with the downloaded file.

> [!WARNING]
> The provided configuration files contain dummy placeholder values and must be replaced with your actual Firebase project configuration files to ensure proper push notifications functionality.

#### Running the app

##### Android

```sh
cordova run android
```
OR open `platforms/android` in Android Studio and run the app.

##### iOS

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

- **Issue**: Support chat doesn't show.
	**Solution**: Ensure you have correctly called one of the identification methods: `DevRev.identifyUnverifiedUser(...)` or `DevRev.identifyVerifiedUser(...)`.

- **Issue**: Not receiving push notifications.
	**Solution**: Ensure that your app is configured to receive push notifications and that your device is registered with the DevRev SDK.

### ProGuard (Android only)

When trying to build your app for Android with ProGuard enabled, refer to these common issues and their solutions.

> [!NOTE]
> You can always refer to the [Android ProGuard documentation](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization#proguard) for more information.

- **Issue**: Missing class `com.google.android.play.core.splitcompat.SplitCompatApplication`.
  **Solution**: Add the following line to your `proguard-rules.pro` file:
  ```proguard
  -dontwarn com.google.android.play.core.**
  ```

- **Issue**: Missing class issue due to transitive Flutter dependencies.
  **Solution**: Add the following lines to your `proguard-rules.pro` file:
  ```proguard
  -keep class io.flutter.** { *; }
  -keep class io.flutter.plugins.** { *; }
  -keep class GeneratedPluginRegistrant { *; }
  ```

- **Issue**: Missing class `org.s1f4j.impl.StaticLoggerBinder`.
  **Solution**: Add the following line to your `proguard-rules.pro` file:
  ```proguard
  -dontwarn org.slf4j.impl.StaticLoggerBinder
  ```

## Migration guide
If you are migrating from the legacy UserExperior SDK to the new DevRev SDK, please refer to the [Migration Guide](./MIGRATION.md) for detailed instructions and feature equivalence.
