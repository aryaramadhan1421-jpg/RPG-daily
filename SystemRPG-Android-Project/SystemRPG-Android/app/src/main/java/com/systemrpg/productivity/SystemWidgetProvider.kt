package com.systemrpg.productivity

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context

class SystemWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        SystemStreakWidget.updateAllWidgets(context)
    }

    companion object {
        fun updateAllWidgets(context: Context) {
            SystemStreakWidget.updateAllWidgets(context)
        }
    }
}
