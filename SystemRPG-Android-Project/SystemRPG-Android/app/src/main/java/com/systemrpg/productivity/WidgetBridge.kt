package com.systemrpg.productivity

import android.content.Context
import android.webkit.JavascriptInterface
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class WidgetBridge(private val context: Context) {

    @JavascriptInterface
    fun updateWidget(
        streak: Int,
        rank: String,
        level: Int,
        dailyPct: Int,
        weekHistory: String
    ) {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val prefs = context.getSharedPreferences(
            SystemStreakWidget.PREFS_NAME,
            Context.MODE_PRIVATE
        )
        prefs.edit()
            .putInt("streak", streak)
            .putString("rank", rank)
            .putInt("level", level)
            .putInt("dailyPct", dailyPct)
            .putString("weekHistory", weekHistory)
            .putString("lastUpdatedDate", todayStr)
            .apply()

        SystemStreakWidget.updateAllWidgets(context)
    }
}
