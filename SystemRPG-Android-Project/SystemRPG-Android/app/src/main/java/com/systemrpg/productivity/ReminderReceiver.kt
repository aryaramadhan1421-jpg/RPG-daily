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
        val lang = (prefs.getString("language", "id") ?: "id").lowercase(Locale.ROOT)

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

        // Five user-chosen reminders fire even after quests are complete;
        // the message below switches to a positive completion note.

        val title = when {
            lang.startsWith("en") -> when (slot) {
                "Pagi" -> "[SYSTEM] Dawn Hunter Check-in, $playerName"
                "Siang" -> "[SYSTEM] Noon Quest Check ($dailyPct%)"
                "Petang" -> "[SYSTEM] Evening Quest Review ($dailyPct%)"
                "Sore" -> "[SYSTEM] Afternoon Check ($dailyPct% Clear)"
                "Malam" -> if (dailyPct >= 100) "[SYSTEM] Daily Quest Perfect Clear!" else "[PENALTY WARNING] Finish Quests Before 00:00!"
                else -> "[SYSTEM] Daily Quest Reminder"
            }
            lang.startsWith("ja") -> when (slot) {
                "Pagi" -> "[SYSTEM] 早朝のハンター点検、$playerName"
                "Siang" -> "[SYSTEM] お昼のクエスト確認 ($dailyPct%)"
                "Petang" -> "[SYSTEM] 夕方の進捗確認 ($dailyPct%)"
                "Sore" -> "[SYSTEM] 夕方の進捗確認 (達成率 $dailyPct%)"
                "Malam" -> if (dailyPct >= 100) "[SYSTEM] デイリークエスト完全達成！" else "[ペナルティ警告] 00:00までにクエストを完了せよ！"
                else -> "[SYSTEM] デイリークエスト通知"
            }
            else -> when (slot) {
                "Pagi" -> "[SYSTEM] Check-in Subuh, $playerName"
                "Siang" -> "[SYSTEM] Pantau Quest Siang ($dailyPct%)"
                "Petang" -> "[SYSTEM] Evaluasi Petang ($dailyPct%)"
                "Sore" -> "[SYSTEM] Evaluasi Sore ($dailyPct% Clear)"
                "Malam" -> if (dailyPct >= 100) "[SYSTEM] Semua Habits Selesai!" else "[PERINGATAN PENALTI] Selesaikan Quest Sebelum 00:00!"
                else -> "[SYSTEM] Pengingat Daily Quest"
            }
        }

        // Streak and HP are separate: only 100% Daily Quests prevents the daily HP penalty.
        val body = when {
            lang.startsWith("en") -> when {
                dailyPct >= 100 -> "Perfect clear (100%)! No daily HP penalty; keep your streak going!"
                dailyPct >= targetPct -> "Streak target reached ($dailyPct% / $targetPct%). Finish all remaining quests to avoid an HP penalty."
                else -> "Daily progress $dailyPct% ($pendingCount quests left). Streak target: $targetPct%. HP is safe only at 100%."
            }
            lang.startsWith("ja") -> when {
                dailyPct >= 100 -> "全クエスト達成（100%）！本日のHPペナルティはありません。"
                dailyPct >= targetPct -> "ストリーク目標達成（$dailyPct% / $targetPct%）。HP減少を防ぐには100%達成が必要です。"
                else -> "現在の達成率は $dailyPct%（残り $pendingCount 件）。ストリーク目標は $targetPct%、HPを守るには100%達成が必要です。"
            }
            else -> when {
                dailyPct >= 100 -> "Perfect Clear 100%! Tidak ada penalti HP hari ini. Pertahankan Streak-mu!"
                dailyPct >= targetPct -> "Target Streak aman ($dailyPct% / $targetPct%). Selesaikan semua Habits agar HP tidak berkurang."
                else -> "Progress $dailyPct% (tersisa $pendingCount Quest). Target Streak $targetPct%; HP aman hanya jika Habits 100%."
            }
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
            .setSmallIcon(R.drawable.ic_notification)
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
