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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ReminderReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action

        // 1. Jika perangkat baru menyala atau aplikasi diperbarui -> jadwalkan ulang semua alarm
        if (action == Intent.ACTION_BOOT_COMPLETED || action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            MainActivity.scheduleExactAlarmsFromPrefs(context)
            MainActivity.scheduleMidnightWidgetReset(context)
            return
        }

        // 2. Jika alarm tengah malam (00:01) berbunyi -> reset widget otomatis
        if (action == MainActivity.ACTION_MIDNIGHT_WIDGET_RESET) {
            MainActivity.handleMidnightWidgetReset(context)
            return
        }

        // 3. Notifikasi pengingat Daily Quest
        val prefs = context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
        if (!prefs.getBoolean("enabled", false)) return

        val slot = intent.getStringExtra("slot") ?: "Harian"
        val pendingCount = prefs.getInt("pendingCount", intent.getIntExtra("pendingCount", 1))
        val playerName = prefs.getString("playerName", null)
            ?: intent.getStringExtra("playerName")
            ?: "Hunter"

        // Ambil dailyPct dan targetPct terbaru dari SystemRpgWidgetPrefs
        val widgetPrefs = context.getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val lastUpdated = widgetPrefs.getString("lastUpdatedDate", "") ?: ""

        // Pastikan angka yang dibaca memang data hari ini (jika belum ada update hari ini, nilainya 0)
        val dailyPct = if (lastUpdated == todayStr) {
            widgetPrefs.getInt("dailyPct", 0)
        } else {
            0
        }

        // Ambil target dinamis yang dipilih pengguna (default 70 jika belum diatur)
        val targetPct = widgetPrefs.getInt("dailyTargetPct", 70)

        // Jika target hari ini sudah >= targetPct dan bukan slot Malam, lewati notifikasi
        if (dailyPct >= targetPct && slot != "Malam") {
            MainActivity.scheduleExactAlarmsFromPrefs(context)
            return
        }

        val title = when (slot) {
            "Pagi" -> "[SYSTEM] Daily Quest Pagi Siap, $playerName"
            "Sore" -> "[SYSTEM] Evaluasi Sore ($dailyPct% Clear)"
            "Malam" -> "[PERINGATAN PENALTI] Selesaikan Quest Sebelum 00:00!"
            else -> "[SYSTEM] Pengingat Daily Quest"
        }

        val body = if (dailyPct >= targetPct) {
            "Target harian sudah aman ($dailyPct%). Pertahankan momentum dan streak kamu!"
        } else {
            "Progress hari ini baru $dailyPct% (masih ada $pendingCount quest tersisa). Capai minimal $targetPct% agar terhindar dari penalti HP!"
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
