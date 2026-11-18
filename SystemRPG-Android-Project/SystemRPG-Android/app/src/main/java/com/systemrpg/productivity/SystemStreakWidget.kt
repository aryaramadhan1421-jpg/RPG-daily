package com.systemrpg.productivity

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.widget.RemoteViews

class SystemStreakWidget : AppWidgetProvider() {

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
        const val PREFS_NAME = "SystemRpgWidgetPrefs"

        fun updateAllWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val idsNew = manager.getAppWidgetIds(
                ComponentName(context, SystemStreakWidget::class.java)
            )
            for (id in idsNew) {
                updateAppWidget(context, manager, id)
            }
            val idsLegacy = manager.getAppWidgetIds(
                ComponentName(context, SystemWidgetProvider::class.java)
            )
            for (id in idsLegacy) {
                updateAppWidget(context, manager, id)
            }
        }

        internal fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val streak = prefs.getInt("streak", 0)
            val rank = prefs.getString("rank", "E-RANK") ?: "E-RANK"
            val level = prefs.getInt("level", 1)
            val dailyPct = prefs.getInt("dailyPct", 0)
            val weekHistory = prefs.getString("weekHistory", "0000000") ?: "0000000"
            
            // Mengambil target dinamis dari SharedPreferences (default 70 jika belum ada)
            val targetPct = prefs.getInt("dailyTargetPct", 70)

            val views = RemoteViews(context.packageName, R.layout.system_streak_widget)

            val dayWord = if (streak == 1) "DAY" else "DAYS"
            views.setTextViewText(R.id.widget_streak, "🔥 $streak $dayWord")
            views.setTextColor(
                R.id.widget_streak,
                if (dailyPct >= targetPct) Color.parseColor("#FB923C") else Color.parseColor("#38BDF8")
            )

            views.setTextViewText(R.id.widget_rank_lv, "$rank • Lv.$level")

            // Status teks bersih tanpa memunculkan tulisan target, 
            // namun evaluasi aman/tidaknya tetap menggunakan variabel targetPct dinamis
            val statusText = if (dailyPct >= targetPct) {
                "Daily Quest: $dailyPct% Clear! • Streak Aman"
            } else {
                "Daily Quest: $dailyPct% Clear!"
            }
            
            views.setTextViewText(R.id.widget_daily_status, statusText)
            views.setTextColor(
                R.id.widget_daily_status,
                if (dailyPct >= targetPct) Color.parseColor("#4ADE80") else Color.parseColor("#CBD5E1")
            )

            val dayIconIds = intArrayOf(
                R.id.day_icon_0, R.id.day_icon_1, R.id.day_icon_2,
                R.id.day_icon_3, R.id.day_icon_4, R.id.day_icon_5, R.id.day_icon_6
            )
            val dayLabelIds = intArrayOf(
                R.id.day_label_0, R.id.day_label_1, R.id.day_label_2,
                R.id.day_label_3, R.id.day_label_4, R.id.day_label_5, R.id.day_label_6
            )

            for (i in 0 until 7) {
                val isDone = i < weekHistory.length && weekHistory[i] == '1'
                if (isDone) {
                    views.setInt(dayIconIds[i], "setBackgroundResource", R.drawable.day_circle_done)
                    views.setTextViewText(dayIconIds[i], "✓")
                    views.setTextColor(dayIconIds[i], Color.parseColor("#0F172A"))
                    views.setTextColor(dayLabelIds[i], Color.parseColor("#22D3EE"))
                } else {
                    views.setInt(dayIconIds[i], "setBackgroundResource", R.drawable.day_circle_pending)
                    views.setTextViewText(dayIconIds[i], "•")
                    views.setTextColor(dayIconIds[i], Color.parseColor("#64748B"))
                    views.setTextColor(dayLabelIds[i], Color.parseColor("#94A3B8"))
                }
            }

            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
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
