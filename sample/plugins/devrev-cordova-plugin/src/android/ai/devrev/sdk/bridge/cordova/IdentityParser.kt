package ai.devrev.sdk.bridge.cordova

import ai.devrev.sdk.model.Identity
import ai.devrev.sdk.model.UserInfo
import ai.devrev.sdk.model.OrganizationInfo
import ai.devrev.sdk.model.AccountInfo
import org.json.JSONObject
import org.json.JSONArray
import org.json.JSONException

object IdentityParser {

    @Throws(JSONException::class)
    fun parseIdentity(map: JSONObject): Identity {
        return Identity(
            map.optString("userID", ""),
            if (map.has("organizationID")) map.optString("organizationID") else null,
            if (map.has("accountID")) map.optString("accountID") else null,
            if (map.has("userTraits")) parseUserTraits(map.getJSONObject("userTraits")) else null,
            if (map.has("organizationTraits")) parseOrganizationTraits(map.getJSONObject("organizationTraits")) else null,
            if (map.has("accountTraits")) parseAccountTraits(map.getJSONObject("accountTraits")) else null
        )
    }

    @Throws(JSONException::class)
    private fun parseUserTraits(map: JSONObject): UserInfo {
        return UserInfo(
            map.optString("displayName", null),
            map.optString("email", null),
            map.optString("fullName", null),
            map.optString("description", null),
            if (map.has("phoneNumbers")) toStringList(map.getJSONArray("phoneNumbers")) else null,
            if (map.has("customFields")) toStringMap(map.getJSONObject("customFields")) else null
        )
    }

    @Throws(JSONException::class)
    private fun parseOrganizationTraits(map: JSONObject): OrganizationInfo {
        return OrganizationInfo(
            map.optString("displayName", null),
            map.optString("domain", null),
            map.optString("description", null),
            if (map.has("phoneNumbers")) toStringList(map.getJSONArray("phoneNumbers")) else null,
            map.optString("tier", null),
            if (map.has("customFields")) toStringMap(map.getJSONObject("customFields")) else null
        )
    }

    @Throws(JSONException::class)
    private fun parseAccountTraits(map: JSONObject): AccountInfo {
        return AccountInfo(
            map.optString("displayName", null),
            if (map.has("domains")) toStringList(map.getJSONArray("domains")) else null,
            map.optString("description", null),
            if (map.has("phoneNumbers")) toStringList(map.getJSONArray("phoneNumbers")) else null,
            if (map.has("websites")) toStringList(map.getJSONArray("websites")) else null,
            map.optString("tier", null),
            if (map.has("customFields")) toStringMap(map.getJSONObject("customFields")) else null
        )
    }

    @Throws(JSONException::class)
    private fun toStringList(array: JSONArray?): List<String>? {
        val list = mutableListOf<String>()
        if (array != null) {
            for (i in 0 until array.length()) {
                list.add(array.getString(i))
            }
        }
        return if (list.isEmpty()) null else list
    }

    @Throws(JSONException::class)
    private fun toStringMap(map: JSONObject?): Map<String, String>? {
        val result = mutableMapOf<String, String>()
        if (map != null) {
            val keys = map.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                val value = map.get(key)
                when (value) {
                    is String, is Number, is Boolean -> result[key] = value.toString()
                    is JSONObject -> result.putAll(toStringMap(value) ?: emptyMap())
                }
            }
        }
        return if (result.isEmpty()) null else result
    }
}
