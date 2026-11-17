package com.systemrpg.productivity

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews

class SystemMiniStatsWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAllWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(
                ComponentName(context, SystemMiniStatsWidget::class.java)
            )
            for (id in ids) {
                updateAppWidget(context, manager, id)
            }
        }

        private fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
            val streak = prefs.getInt("streak", 0)
            val rank = prefs.getString("rank", "E-RANK") ?: "E-RANK"
            val level = prefs.getInt("level", 1)
            val hp = prefs.getInt("hp", 100)
            val maxHp = prefs.getInt("maxHp", 100).coerceAtLeast(1)
            val dailyPct = prefs.getInt("dailyPct", 0).coerceIn(0, 100)

            val views = RemoteViews(context.packageName, R.layout.system_mini_stats_widget)

            // Rank & Level
            views.setTextViewText(R.id.mini_rank, rank)
            views.setTextViewText(R.id.mini_level, "Lv.$level • 🔥$streak")

            // HP Bar & Text
            views.setTextViewText(R.id.mini_hp_text, "HP $hp/$maxHp")
            views.setProgressBar(R.id.mini_hp_bar, maxHp, hp.coerceIn(0, maxHp), false)

            // Daily Quest Progress Bar & Text
            views.setTextViewText(R.id.mini_daily_text, "DAILY $dailyPct%")
            views.setTextColor(
                R.id.mini_daily_text,
                if (dailyPct >= 70) Color.parseColor("#4ADE80") else Color.parseColor("#22D3EE")
            )
            views.setProgressBar(R.id.mini_daily_bar, 100, dailyPct, false)

            // Klik widget -> Buka SYSTEM RPG
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                1,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.mini_widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
