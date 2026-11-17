package com.systemrpg.productivity

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews

class SystemWidgetProvider : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAllWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, SystemWidgetProvider::class.java))
            for (id in ids) {
                updateAppWidget(context, manager, id)
            }
        }

        private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = context.getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
            val streak = prefs.getInt("streak", 0)
            val rank = prefs.getString("rank", "E-RANK") ?: "E-RANK"
            val level = prefs.getInt("level", 1)
            val hp = prefs.getInt("hp", 100)
            val maxHp = prefs.getInt("maxHp", 100)
            val dailyPct = prefs.getInt("dailyPct", 0)

            val views = RemoteViews(context.packageName, R.layout.widget_system_rpg)
            views.setTextViewText(R.id.widget_streak, "🔥 $streak HARI STREAK")
            views.setTextColor(
                R.id.widget_streak,
                if (dailyPct >= 70) Color.parseColor("#FB923C") else Color.parseColor("#94A3B8")
            )
            views.setTextViewText(R.id.widget_rank_lv, "$rank • Lv.$level")
            views.setTextViewText(R.id.widget_hp, "❤️ HP: $hp / $maxHp")

            val dailyStatus = if (dailyPct >= 70) {
                "✅ Daily Quest: $dailyPct% (Streak Aman!)"
            } else {
                "⚔️ Daily Quest: $dailyPct% (Target ≥70%)"
            }
            views.setTextViewText(R.id.widget_daily, dailyStatus)
            views.setTextColor(
                R.id.widget_daily,
                if (dailyPct >= 70) Color.parseColor("#4ADE80") else Color.parseColor("#CBD5E1")
            )

            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
