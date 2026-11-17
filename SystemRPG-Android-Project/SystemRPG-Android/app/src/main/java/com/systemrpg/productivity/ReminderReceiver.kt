package com.systemrpg.productivity

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val slot = intent.getStringExtra("slot") ?: "HARIAN"
        val pendingCount = intent.getIntExtra("pendingCount", 0)
        val playerName = intent.getStringExtra("playerName") ?: "Hunter"

        val channelId = "system_rpg_channel"
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "SYSTEM RPG Reminder",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifikasi pengingat Daily Quest SYSTEM RPG"
                enableVibration(true)
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

        val title = "⚔️ SYSTEM RPG // REMINDER ${slot.uppercase()}"
        val body = if (pendingCount > 0) {
            "Hunter $playerName, masih ada $pendingCount Daily Quest tersisa! Selesaikan minimal 70% agar Streak aman."
        } else {
            "Hunter $playerName, waktunya cek Quest Board & jaga Streak kamu di SYSTEM RPG!"
        }

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

        manager.notify(slot.hashCode(), notification)
    }
}
