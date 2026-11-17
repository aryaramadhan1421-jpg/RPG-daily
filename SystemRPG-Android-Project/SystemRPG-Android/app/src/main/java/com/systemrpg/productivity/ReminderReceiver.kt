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
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            MainActivity.scheduleExactAlarmsFromPrefs(context)
            return
        }

        MainActivity.scheduleExactAlarmsFromPrefs(context)

        val prefs = context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
        val slot = intent.getStringExtra("slot") ?: "Harian"
        val playerName = intent.getStringExtra("playerName")
            ?: prefs.getString("playerName", "Hunter")
            ?: "Hunter"
        val pendingCount = intent.getIntExtra("pendingCount", prefs.getInt("pendingCount", 1))

        if (pendingCount <= 0) return

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
            slot.hashCode(),
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val body = "Hunter $playerName, masih ada $pendingCount Daily Quest belum selesai. Ayo buka SYSTEM RPG!"

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle("⚔️ SYSTEM // Pengingat $slot")
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setContentIntent(contentIntent)
            .setAutoCancel(true)
            .build()

        manager.notify(slot.hashCode(), notification)
    }
}
