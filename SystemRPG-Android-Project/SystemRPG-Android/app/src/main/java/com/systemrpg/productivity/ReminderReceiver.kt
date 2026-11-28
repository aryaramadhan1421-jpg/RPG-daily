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
        val progressBody = when {
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

        // Daily rotation per slot. No change to user-selected alarm times.
        val banks = mapOf(
            "Pagi" to listOf(
                listOf("Mulai hari dengan satu quest ringan.", "Start with one easy quest.", "簡単なクエストから始めよう。"),
                listOf("Hari baru, kesempatan baru.", "A new day, a new opportunity.", "新しい一日、新しい機会。"),
                listOf("Bangun ritme sebelum mengejar target.", "Build your rhythm before chasing targets.", "目標の前にリズムを整えよう。"),
                listOf("Satu langkah kecil membuka perjalanan hari ini.", "One small step opens today’s journey.", "小さな一歩から今日の旅が始まる。"),
                listOf("Pilih misi pertama yang paling mudah dimulai.", "Choose the mission that is easiest to start.", "最も始めやすい任務を選ぼう。"),
                listOf("Awali pagi dengan fokus dan tenang.", "Begin the morning calmly and focused.", "落ち着いて集中し朝を始めよう。"),
                listOf("Periksa jadwal sebelum memulai aktivitas.", "Check your schedule before getting started.", "始める前に予定を確認しよう。"),
                listOf("Momentum tumbuh dari langkah pertama.", "Momentum grows from the first step.", "勢いは最初の一歩から生まれる。"),
                listOf("Hunter, siapkan perlengkapan dan prioritasmu.", "Hunter, prepare your gear and priorities.", "ハンター、準備と優先順位を整えよう。"),
                listOf("Tidak perlu sempurna untuk mulai.", "You need not be perfect to begin.", "完璧でなくても始められる。")
            ),
            "Siang" to listOf(
                listOf("Cek progres dan ambil jeda sejenak.", "Check progress and take a short break.", "進捗を確認し少し休憩しよう。"),
                listOf("Setengah hari telah berlalu; pilih prioritas berikutnya.", "Half the day has passed; choose your next priority.", "一日の半分が過ぎた。次の優先課題を選ぼう。"),
                listOf("Isi energi sebelum melanjutkan misi.", "Refuel before continuing your missions.", "任務の続きの前にエネルギーを補給しよう。"),
                listOf("Pencapaian kecil tetap berarti.", "Small achievements still count.", "小さな達成にも意味がある。"),
                listOf("Periksa quest yang paling memungkinkan dikerjakan.", "Look for the quest you can realistically tackle.", "今取り組めるクエストを探そう。"),
                listOf("Atur ulang fokus untuk sisa hari.", "Reset your focus for the rest of the day.", "残りの一日に向け集中を整えよう。"),
                listOf("Jangan lupa makan dan beristirahat.", "Remember to eat and rest.", "食事と休憩を忘れずに。"),
                listOf("Checkpoint siang: tinjau daftar misi.", "Midday checkpoint: review your missions.", "昼の確認：任務一覧を見直そう。"),
                listOf("Selesaikan satu tugas pada satu waktu.", "Finish one task at a time.", "一つずつ取り組もう。"),
                listOf("Kemajuan bukan perlombaan.", "Progress is not a race.", "成長は競争ではない。")
            ),
            "Sore" to listOf(
                listOf("Masih ada waktu untuk mengubah hasil hari ini.", "There is still time to shape today’s outcome.", "今日の結果を変える時間はまだある。"),
                listOf("Pilih satu quest yang tertunda.", "Choose one pending quest.", "残っているクエストを一つ選ぼう。"),
                listOf("Lanjutkan ritme yang sudah dibangun.", "Continue the rhythm you have built.", "積み上げたリズムを続けよう。"),
                listOf("Coba selesaikan tugas ringan terlebih dahulu.", "Try finishing a lighter task first.", "まず軽い課題から終えよう。"),
                listOf("Sore adalah kesempatan untuk kembali fokus.", "The afternoon is a chance to refocus.", "午後は集中を取り戻す機会。"),
                listOf("Tinjau rencana dan sesuaikan dengan tenaga.", "Review your plan and match it to your energy.", "計画を見直し体力に合わせよう。"),
                listOf("Satu misi selesai lebih baik daripada menunda semuanya.", "One mission finished beats postponing them all.", "一つの達成は全ての先延ばしより良い。"),
                listOf("Bergerak sedikit sebelum kembali belajar.", "Move a little before returning to study.", "学習に戻る前に少し体を動かそう。"),
                listOf("Checkpoint sore: lanjutkan yang memungkinkan.", "Afternoon checkpoint: continue what is manageable.", "午後の確認：無理なくできることを続けよう。"),
                listOf("Tetap tenang dan kerjakan prioritasmu.", "Stay calm and work on your priorities.", "落ち着いて優先課題に取り組もう。")
            ),
            "Petang" to listOf(
                listOf("Review perjalanan hari ini.", "Review today’s journey.", "今日の歩みを振り返ろう。"),
                listOf("Cahaya memudar; periksa misi yang tersisa.", "The light fades; check remaining missions.", "日が暮れる。残る任務を確認しよう。"),
                listOf("Siapkan langkah terakhir yang realistis.", "Prepare a realistic final step.", "無理のない最後の一歩を準備しよう。"),
                listOf("Hargai usaha yang sudah kamu lakukan.", "Acknowledge the effort you have made.", "ここまでの努力を認めよう。"),
                listOf("Tinjau prioritas sebelum memasuki malam.", "Review priorities before nightfall.", "夜の前に優先順位を見直そう。"),
                listOf("Rapikan rencana dan ruang istirahatmu.", "Organize your plan and resting space.", "計画と休む場所を整えよう。"),
                listOf("Selesaikan yang penting, bukan semua sekaligus.", "Focus on what matters, not everything at once.", "一度に全部ではなく大切なことを。"),
                listOf("Perhatikan energi yang tersisa.", "Notice how much energy you have left.", "残りの体力に気を配ろう。"),
                listOf("Checkpoint petang: lihat perkembangan Hunter.", "Evening checkpoint: review Hunter progress.", "夕暮れの確認：ハンターの進捗を見よう。"),
                listOf("Catat satu hal baik dari hari ini.", "Note one good thing from today.", "今日の良かったことを一つ記そう。")
            ),
            "Malam" to listOf(
                listOf("Pemeriksaan terakhir sebelum tengah malam.", "Final check before midnight.", "深夜前の最終確認。"),
                listOf("Hari hampir berakhir; tinjau misi hari ini.", "The day is nearly over; review today’s missions.", "一日が終わる前に今日の任務を確認しよう。"),
                listOf("Selesaikan yang memungkinkan lalu beristirahat.", "Finish what is manageable, then rest.", "無理なくできることを終え、休もう。"),
                listOf("Siapkan diri untuk hari esok.", "Prepare for tomorrow.", "明日に備えよう。"),
                listOf("Jangan korbankan waktu tidur untuk mengejar angka.", "Do not sacrifice sleep to chase numbers.", "数字のために睡眠を犠牲にしないで。"),
                listOf("Tutup perjalanan hari ini dengan tenang.", "Close today’s journey calmly.", "今日の旅を穏やかに締めくくろう。"),
                listOf("Periksa daftar misi untuk terakhir kali.", "Check the mission list one last time.", "任務一覧を最後に確認しよう。"),
                listOf("Refleksikan satu pelajaran dari hari ini.", "Reflect on one lesson from today.", "今日の学びを一つ振り返ろう。"),
                listOf("Persiapkan misi pertama besok.", "Prepare tomorrow’s first mission.", "明日の最初の任務を準備しよう。"),
                listOf("Istirahat adalah bagian dari perjalanan Hunter.", "Rest is part of a Hunter’s journey.", "休息もハンターの旅の一部。")
            )
        )
        val langIndex = if (lang.startsWith("en")) 1 else if (lang.startsWith("ja")) 2 else 0
        val utcDate = SimpleDateFormat("yyyy-MM-dd", Locale.US).apply { timeZone = java.util.TimeZone.getTimeZone("UTC") }
        val dayNumber = (utcDate.parse(todayStr)?.time ?: 0L) / 86400000L
        val bank = banks[slot]
        val prompt = bank?.let { it[((dayNumber % it.size + it.size) % it.size).toInt()][langIndex] } ?: ""
        // Don't invent today's counts from yesterday's saved schedule.
        val fresh = lastUpdated == todayStr && prefs.getString("progressDate", "") == todayStr
        val noQuests = fresh && prefs.getInt("totalCount", -1) == 0
        val rest = listOf("Tidak ada quest terjadwal. Nikmati waktu istirahat.", "No quests scheduled. Enjoy your rest.", "本日のクエスト予定はありません。ゆっくり休もう。")[langIndex]
        val unknown = listOf("Buka SYSTEM RPG untuk melihat progres hari ini.", "Open SYSTEM RPG to check today's progress.", "SYSTEM RPGを開いて今日の進捗を確認しよう。")[langIndex]
        val completedBank = listOf(
            listOf("Semua misi selesai. Nikmati waktu istirahat.", "All missions complete. Enjoy your rest.", "全任務達成。ゆっくり休もう。"),
            listOf("Hargai usaha hari ini.", "Celebrate your effort today.", "今日の努力を認めよう。"),
            listOf("Hari ini berhasil dituntaskan.", "Today’s missions are complete.", "今日の任務は完了した。"),
            listOf("Isi kembali energimu.", "Recharge your energy.", "エネルギーを回復しよう。"),
            listOf("Perjalanan berlanjut esok hari.", "The journey continues tomorrow.", "旅は明日も続く。")
        )
        val clearOffset = listOf("Pagi", "Siang", "Sore", "Petang", "Malam").indexOf(slot).coerceAtLeast(0)
        val completed = completedBank[(((dayNumber + clearOffset) % completedBank.size + completedBank.size) % completedBank.size).toInt()][langIndex]
        val body = when {
            !fresh -> "$prompt $unknown"
            noQuests -> rest
            dailyPct >= 100 -> "$progressBody $completed"
            else -> "$prompt $progressBody"
        }
        val safeTitle = if (!fresh || noQuests) listOf("[SYSTEM] Pengingat Hunter", "[SYSTEM] Hunter Reminder", "[SYSTEM] ハンター通知")[langIndex] else title
        showReminderNotification(context, safeTitle, body)
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
