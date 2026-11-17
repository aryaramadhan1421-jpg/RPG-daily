package com.systemrpg.productivity

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat

class ReminderReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action

        // 1. Jika perangkat baru menyala atau aplikasi diperbarui -> jadwalkan ulang semua alarm
        if (action == Intent.ACTION_BOOT_COMPLETED || action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            MainActivity.scheduleExactAlarmsFromPrefs(context)
            MainActivity.scheduleMidnightWidgetReset(context)
            return
        }

        // 2. Fitur #4: Jika alarm tengah malam (00:01) berbunyi -> reset widget & progres reminder otomatis
        if (action == MainActivity.ACTION_MIDNIGHT_WIDGET_RESET) {
            val reminderPrefs = context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
            reminderPrefs.edit()
                .putInt("pct", 0)
                .putInt("dailyPct", 0)
                .putInt("doneCount", 0)
                .apply()

            MainActivity.handleMidnightWidgetReset(context)
            return
        }

        // 3. Notifikasi pengingat Daily Quest
        val prefs = context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
        if (!prefs.getBoolean("enabled", false)) return

        val slot = intent.getStringExtra("slot") ?: "Harian"

        // Prioritaskan data terbaru dari SharedPreferences daripada Intent alarm lama
        val pendingCount = if (prefs.contains("pendingCount")) {
            prefs.getInt("pendingCount", 0)
        } else {
            intent.getIntExtra("pendingCount", 1)
        }

        val playerName = prefs.getString("playerName", null)
            ?: intent.getStringExtra("playerName")
            ?: "Hunter"

        val doneCount = prefs.getInt("doneCount", 0)
        val totalCount = prefs.getInt("totalCount", doneCount + pendingCount)
        val thresholdPct = prefs.getInt("thresholdPct", 70)

        // Ambil persentase terbaru: cek SystemRpgReminderPrefs dulu, lalu fallback ke SystemRpgWidgetPrefs atau hitung manual
        val widgetPrefs = context.getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
        val dailyPct = when {
            prefs.contains("pct") -> prefs.getInt("pct", 0)
            prefs.contains("dailyPct") -> prefs.getInt("dailyPct", 0)
            widgetPrefs.contains("dailyPct") -> widgetPrefs.getInt("dailyPct", 0)
            totalCount > 0 -> ((doneCount * 100.0) / totalCount).toInt()
            else -> 0
        }

        // Cek apakah target hari ini sudah >= thresholdPct (default 70%)
        if (dailyPct >= thresholdPct && slot != "Malam") {
            MainActivity.scheduleExactAlarmsFromPrefs(context)
            return
        }

        val title = when (slot) {
            "Pagi" -> "[SYSTEM] Daily Quest Pagi Siap, $playerName"
            "Sore" -> "[SYSTEM] Evaluasi Sore ($dailyPct% Clear)"
            "Malam" -> "[PERINGATAN PENALTI] Selesaikan Quest Sebelum 00:00!"
            else -> "[SYSTEM] Pengingat Daily Quest"
        }

        val body = if (dailyPct >= thresholdPct) {
            "Target harian sudah aman ($dailyPct%). Pertahankan momentum dan streak kamu!"
        } else {
            "Progress hari ini baru $dailyPct% (masih ada $pendingCount quest tersisa). Capai minimal $thresholdPct% agar terhindar dari penalti HP!"
        }

        showReminderNotification(context, title, body)
        MainActivity.scheduleExactAlarmsFromPrefs(context)
    }

    private fun showReminderNotification(context: Context, title: String, body: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val channelId = "system_rpg_channel"
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "SYSTEM RPG Reminder",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifikasi pop-up pengingat Daily Quest SYSTEM RPG"
                enableVibration(true)
                enableLights(true)
            }
            manager.createNotificationChannel(channel)
        }

        val launchIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val contentIntent = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .build()

        manager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
