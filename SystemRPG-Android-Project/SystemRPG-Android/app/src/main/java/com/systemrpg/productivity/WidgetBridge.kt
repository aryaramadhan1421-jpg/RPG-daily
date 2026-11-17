package com.systemrpg.productivity

import android.content.Context
import android.webkit.JavascriptInterface

class WidgetBridge(private val context: Context) {

    @JavascriptInterface
    fun updateWidget(
        streak: Int,
        rank: String,
        level: Int,
        dailyPct: Int,
        weekHistory: String
    ) {
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
            .apply()

        SystemStreakWidget.updateAllWidgets(context)
    }
}
