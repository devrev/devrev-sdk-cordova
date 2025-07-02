package ai.devrev.sdk.bridge.cordova

import android.util.Log
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import ai.devrev.sdk.DevRev
import ai.devrev.sdk.addSessionProperties
import ai.devrev.sdk.clearSessionProperties
import ai.devrev.sdk.endTimer
import ai.devrev.sdk.getSessionUrl
import ai.devrev.sdk.pauseRecording
import ai.devrev.sdk.processAllOnDemandSessions
import ai.devrev.sdk.resumeAllMonitoring
import ai.devrev.sdk.resumeRecording
import ai.devrev.sdk.showSupport
import ai.devrev.sdk.startRecording
import ai.devrev.sdk.startTimer
import ai.devrev.sdk.stopAllMonitoring
import ai.devrev.sdk.stopRecording
import ai.devrev.sdk.trackEvent
import ai.devrev.sdk.trackScreenName
import ai.devrev.sdk.setInScreenTransitioning
import ai.devrev.sdk.processAllOnDemandSessions
import org.apache.cordova.PluginResult

class DevRevPluginCordova : CordovaPlugin() {

  private var inAppLinkHandler: ((String) -> Unit)? = null

  companion object {
    private const val TAG = "DevRevPluginCordova"
  }

  override fun execute(action: String, args: JSONArray, callbackContext: CallbackContext): Boolean {
    return try {
      val method = Method.getMethod(action)

      if (method == null) {
        callbackContext.error("Unknown method: $action")
        return false
      }

      val context = this.cordova.activity.applicationContext

      when (method) {
        Method.CONFIGURE -> {
          val appId = args.getString(0)
          DevRev.configure(context, appId, false)
          callbackContext.success("Configured with App ID: $appId")
        }
        Method.IDENTIFY_UNVERIFIED_USER -> {
          val identityJSON = args.getJSONObject(0)
          val identity = IdentityParser.parseIdentity(identityJSON)
          DevRev.identifyUnverifiedUser(identity)
          callbackContext.success("Unverified user identified with user ID: ${identity.userId}")
        }
        Method.IDENTIFY_VERIFIED_USER -> {
          val userId = args.getString(0)
          val sessionToken = args.getString(1)
          DevRev.identifyVerifiedUser(userId, sessionToken)
          callbackContext.success("Verified user identified with user ID: $userId")
        }
        Method.IDENTIFY_ANONYMOUS_USER -> {
          val userId = args.getString(0)
          DevRev.identifyAnonymousUser(userId)
          callbackContext.success("Anonymous user identified with user ID: $userId")
        }
        Method.UPDATE_USER -> {
          val identityJSON = args.getJSONObject(0)
          val identity = IdentityParser.parseIdentity(identityJSON)
          DevRev.updateUser(identity)
          callbackContext.success("User updated with user ID: ${identity.userId}")
        }
        Method.LOGOUT -> {
          val deviceID = args.getString(0)
          DevRev.logout(context, deviceID)
          callbackContext.success("User logged out with device ID: $deviceID")
        }
        Method.SHOW_SUPPORT -> {
          cordova.threadPool.execute {

            DevRev.showSupport(context)
            callbackContext.success("Support screen shown")
          }
        }
        Method.CREATE_SUPPORT_CONVERSATION -> {
          cordova.threadPool.execute {

            DevRev.createSupportConversation(context)
            callbackContext.success("Create conversation screen shown")
          }
        }
        Method.TRACK_EVENT -> {
          val eventName = args.getString(0)
          val propertiesJSON = args.getJSONObject(1)
          val propertiesMap = propertiesFromJSON(propertiesJSON)
          if (propertiesMap != null) {
            DevRev.trackEvent(eventName, propertiesMap)
            callbackContext.success("Event tracked: $eventName")
          } else {
            callbackContext.error("Failed to parse event properties")
          }
        }
        Method.START_RECORDING -> {
          DevRev.startRecording(context)
          callbackContext.success("Recording started")
        }
        Method.STOP_RECORDING -> {
          DevRev.stopRecording()
          callbackContext.success("Recording stopped")
        }
        Method.PAUSE_RECORDING -> {
          DevRev.pauseRecording()
          callbackContext.success("Recording paused")
        }
        Method.RESUME_RECORDING -> {
          DevRev.resumeRecording()
          callbackContext.success("Recording resumed")
        }
        Method.PROCESS_ALL_ON_DEMAND_SESSION -> {
          DevRev.processAllOnDemandSessions()
          callbackContext.success("On-demand Sessions Processed Successfully")
        }
        Method.ADD_SESSION_PROPERTIES -> {
          val propertiesJSON = args.getJSONObject(0)
          val propertiesMap = propertiesFromJSON(propertiesJSON)
          if (propertiesMap != null) {
            DevRev.addSessionProperties(HashMap(propertiesMap))
            callbackContext.success("Session properties added")
          } else {
            callbackContext.error("Failed to parse session properties")
          }
        }
        Method.CLEAR_SESSION_PROPERTIES -> {
          DevRev.clearSessionProperties()
          callbackContext.success("Session properties cleared")
        }
        Method.START_TIMER -> {
          val timerName = args.getString(0)
          val propertiesJSON = args.getJSONObject(1)
          val propertiesMap = propertiesFromJSON(propertiesJSON)
          if (propertiesMap != null) {
            DevRev.startTimer(timerName, propertiesMap)
            callbackContext.success("Timer started: $timerName")
          } else {
            callbackContext.error("Failed to parse timer properties")
          }
        }
        Method.END_TIMER -> {
          val timerName = args.getString(0)
          val propertiesJSON = args.getJSONObject(1)
          val propertiesMap = propertiesFromJSON(propertiesJSON)
          if (propertiesMap != null) {
            DevRev.endTimer(timerName, propertiesMap)
            callbackContext.success("Timer ended: $timerName")
          } else {
            callbackContext.error("Failed to parse timer properties")
          }
        }
        Method.RESUME_ALL_MONITORING -> {
          DevRev.resumeAllMonitoring()
          callbackContext.success("All monitoring resumed")
        }
        Method.STOP_ALL_MONITORING -> {
          DevRev.stopAllMonitoring()
          callbackContext.success("All monitoring stopped")
        }
        Method.GET_SESSION_URL -> {
          val platformName = args.getString(0)
          DevRev.getSessionUrl(platformName)
          callbackContext.success("Session URL retrieved for platform: $platformName")
        }
        Method.SET_IN_APP_LINK_HANDLER -> {
          inAppLinkHandler = { url ->
            val result = PluginResult(PluginResult.Status.OK, JSONObject(mapOf("url" to url))).apply {
                keepCallback = true
            }
            callbackContext.sendPluginResult(result)
          }
          inAppLinkHandler?.let {
            DevRev.setInAppLinkHandler(it)
            val result = PluginResult(PluginResult.Status.OK).apply {
              keepCallback = true
            }
            callbackContext.sendPluginResult(result)
          }
        }
        Method.SET_SHOULD_DISMISS_MODALS_ON_OPEN_LINK -> {
          val value = args.getBoolean(0)
          DevRev.setShouldDismissModalsOnOpenLink(value)
          callbackContext.success("The flag is set successfully whether or not modals are dismissed.: $value")
        }
        Method.TRACK_SCREEN_NAME -> {
          val screenName = args.getString(0)
          DevRev.trackScreenName(screenName)
          callbackContext.success("Screen tracked: $screenName")
        }
        Method.SET_IN_SCREEN_TRANSITIONING -> {
          val isTransitioning = args.getBoolean(0)
          DevRev.setInScreenTransitioning(isTransitioning)
          callbackContext.success("Screen transition state set to: $isTransitioning")
        }
        Method.REGISTER_DEVICE_TOKEN -> {
          val deviceToken = args.getString(0)
          val deviceId = args.getString(1)
          DevRev.registerDeviceToken(context, deviceToken, deviceId)
          callbackContext.success("Device token registered for device ID: $deviceId")
        }
        Method.UNREGISTER_DEVICE -> {
          val deviceId = args.getString(0)
          DevRev.unregisterDevice(context, deviceId)
          callbackContext.success("Device unregistered with device ID: $deviceId")
        }
        Method.PROCESS_PUSH_NOTIFICATION -> {
          val payload = args.getString(0)
          DevRev.processPushNotification(context, payload)
          callbackContext.success("Push notification processed")
        }
        Method.SET_CUSTOM_KEY -> {
          val key = args.getString(0)
          DevRev.setCustomKey(key)
          callbackContext.success("Custom key set: $key")
        }
        Method.CRASH -> {
          Runtime.getRuntime().exit(1)
          callbackContext.success("Crash triggered")
        }
        else -> {
          callbackContext.error("Unsupported method: $action")
          return false
        }
      }
      true
    } catch (e: JSONException) {
      Log.e(TAG, "JSON parsing error: ${e.message}")
      callbackContext.error("JSON error: ${e.message}")
      false
    } catch (e: Exception) {
      Log.e(TAG, "Error in DevRevPlugin for Cordova: ${e.message}")
      callbackContext.error("Error: ${e.message}")
      false
    }
  }

  private fun propertiesFromJSON(jsonObject: JSONObject): HashMap<String, String>? {
    val properties = HashMap<String, String>()
    val keys = jsonObject.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      try {
        properties[key] = jsonObject.getString(key)
      } catch (e: JSONException) {
        Log.e(TAG, "Error parsing property: $key", e)
      }
    }
    return properties
  }
}
