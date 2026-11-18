package com.systemrpg.productivity

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private val CHANNEL_ID = "system_rpg_channel"

    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (filePathCallback == null) return@registerForActivityResult

        var results: Array<Uri>? = null
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val dataString = result.data?.dataString
            val clipData = result.data?.clipData

            if (clipData != null) {
                results = Array(clipData.itemCount) { i ->
                    clipData.getItemAt(i).uri
                }
            } else if (dataString != null) {
                results = arrayOf(Uri.parse(dataString))
            }
        }

        filePathCallback?.onReceiveValue(results)
        filePathCallback = null
    }

    inner class AndroidBridge {
        @JavascriptInterface
        fun setKeepScreenOn(enable: Boolean) {
            runOnUiThread {
                if (enable) {
                    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                } else {
                    window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                }
            }
        }

        @JavascriptInterface
        fun requestNotificationPermission() {
            runOnUiThread {
                askNotificationPermissionIfNeeded()
            }
        }

        @JavascriptInterface
        fun showNotification(title: String, body: String) {
            runOnUiThread {
                askNotificationPermissionIfNeeded()
                fireTopScreenNotification(title, body)
            }
        }

        @JavascriptInterface
        fun scheduleDailyReminders(timesJson: String, pendingCount: Int, playerName: String) {
            getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE).edit()
                .putBoolean("enabled", true)
                .putString("timesJson", timesJson)
                .putInt("pendingCount", pendingCount)
                .putString("playerName", playerName)
                .apply()

            scheduleExactAlarmsFromPrefs(this@MainActivity)
        }

        // Jembatan yang diperbarui untuk menangkap streak & thresholdPct secara dinamis dari HTML
        @JavascriptInterface
        fun scheduleDailyRemindersFull(payloadJson: String) {
            try {
                val obj = JSONObject(payloadJson)
                val timesObj = obj.optJSONObject("times")
                val pendingCount = obj.optInt("pendingCount", 0)
                val doneCount = obj.optInt("doneCount", 0)
                val totalCount = obj.optInt("totalCount", 0)
                val pct = obj.optInt("pct", 0)
                val thresholdPct = obj.optInt("thresholdPct", 70)
                val playerName = obj.optString("playerName", "Hunter")
                
                // Ambil streak yang dikirimkan dari JavaScript (jika tidak ada, fallback ke SharedPreferences)
                val widgetPrefs = getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
                val streak = obj.optInt("streak", widgetPrefs.getInt("streak", 0))

                val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

                val remPrefs = getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
                val editor = remPrefs.edit()
                    .putBoolean("enabled", true)
                    .putInt("pendingCount", pendingCount)
                    .putInt("doneCount", doneCount)
                    .putInt("totalCount", totalCount)
                    .putInt("pct", pct)
                    .putInt("dailyPct", pct)
                    .putInt("thresholdPct", thresholdPct)
                    .putString("playerName", playerName)

                if (timesObj != null) {
                    editor.putString("timesJson", timesObj.toString())
                }
                editor.apply()

                // Simpan streak, dailyPct, dan target dinamis (dailyTargetPct) ke WidgetPrefs
                val weekHistory = computeWeekHistory(streak, pct)
                widgetPrefs.edit()
                    .putInt("streak", streak)
                    .putInt("dailyPct", pct)
                    .putInt("dailyTargetPct", thresholdPct)
                    .putString("weekHistory", weekHistory)
                    .putString("lastUpdatedDate", todayStr)
                    .apply()

                refreshAllAppWidgets(this@MainActivity)
                scheduleExactAlarmsFromPrefs(this@MainActivity)
            } catch (_: Exception) {
            }
        }

        @JavascriptInterface
        fun cancelDailyReminders() {
            getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE).edit()
                .putBoolean("enabled", false)
                .apply()

            try {
                val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
                for (reqCode in listOf(1001, 1002, 1003)) {
                    val intent = Intent(this@MainActivity, ReminderReceiver::class.java)
                    val pendingIntent = PendingIntent.getBroadcast(
                        this@MainActivity,
                        reqCode,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    alarmManager.cancel(pendingIntent)
                }
            } catch (_: Exception) {
            }
        }

        // Fitur Haptic Feedback (Getaran Fisik HP)
        @JavascriptInterface
        fun vibrate(durationMs: Long) {
            triggerVibration(durationMs.coerceIn(10L, 2000L), null)
        }

        @JavascriptInterface
        fun hapticFeedback(type: String) {
            when (type.lowercase(Locale.ROOT)) {
                "quest", "check", "tap" -> triggerVibration(35L, null)
                "complete", "claim" -> triggerVibration(0L, longArrayOf(0, 45, 50, 75))
                "levelup", "rankup" -> triggerVibration(0L, longArrayOf(0, 60, 50, 90, 60, 160))
                "damage", "penalty", "error" -> triggerVibration(0L, longArrayOf(0, 120, 60, 120))
                else -> triggerVibration(35L, null)
            }
        }

        @JavascriptInterface
        fun updateWidgetData(streak: Int, rank: String, level: Int, hp: Int, maxHp: Int, dailyPct: Int) {
            val weekHistory = computeWeekHistory(streak, dailyPct)
            saveAndRefreshWidget(streak, rank, level, hp, maxHp, dailyPct, weekHistory)
        }

        @JavascriptInterface
        fun updateWidgetDataWithHistory(
            streak: Int,
            rank: String,
            level: Int,
            hp: Int,
            maxHp: Int,
            dailyPct: Int,
            weekHistory: String
        ) {
            val cleanHistory = if (weekHistory.length == 7) weekHistory else computeWeekHistory(streak, dailyPct)
            saveAndRefreshWidget(streak, rank, level, hp, maxHp, dailyPct, cleanHistory)
        }

        private fun saveAndRefreshWidget(
            streak: Int,
            rank: String,
            level: Int,
            hp: Int,
            maxHp: Int,
            dailyPct: Int,
            weekHistory: String
        ) {
            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
            val prefs = getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
            prefs.edit()
                .putInt("streak", streak)
                .putString("rank", rank)
                .putInt("level", level)
                .putInt("hp", hp)
                .putInt("maxHp", maxHp)
                .putInt("dailyPct", dailyPct)
                .putString("weekHistory", weekHistory)
                .putString("lastUpdatedDate", todayStr)
                .apply()

            // Sinkronkan juga dailyPct ke ReminderPrefs
            getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE).edit()
                .putInt("pct", dailyPct)
                .putInt("dailyPct", dailyPct)
                .apply()

            refreshAllAppWidgets(this@MainActivity)
        }

        private fun computeWeekHistory(streak: Int, dailyPct: Int): String {
            val cal = Calendar.getInstance()
            val dow = cal.get(Calendar.DAY_OF_WEEK) // 1=Sun, 2=Mon, ..., 7=Sat
            val todayIdx = if (dow == Calendar.SUNDAY) 6 else dow - 2
            val chars = CharArray(7) { '0' }

            // Ambil threshold target dinamis dari prefs (default 70 jika belum ada)
            val prefs = getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
            val threshold = prefs.getInt("dailyTargetPct", 70)

            if (dailyPct >= threshold) {
                chars[todayIdx] = '1'
            }
            val pastDays = if (dailyPct >= threshold) (streak - 1).coerceAtLeast(0) else streak.coerceAtLeast(0)
            var i = 1
            while (i <= pastDays && todayIdx - i >= 0) {
                chars[todayIdx - i] = '1'
                i++
            }
            return String(chars)
        }
    }

    private fun triggerVibration(durationMs: Long, pattern: LongArray?) {
        try {
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vm.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            }

            if (!vibrator.hasVibrator()) return

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (pattern != null) {
                    vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1))
                } else {
                    vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
                }
            } else {
                @Suppress("DEPRECATION")
                if (pattern != null) {
                    vibrator.vibrate(pattern, -1)
                } else {
                    vibrator.vibrate(durationMs)
                }
            }
        } catch (_: Exception) {
        }
    }

    private fun createHighPriorityNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "SYSTEM RPG Reminder",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifikasi pop-up pengingat Daily Quest SYSTEM RPG"
                enableVibration(true)
                enableLights(true)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun askNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    101
                )
            }
        }
    }

    private fun fireTopScreenNotification(title: String, body: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val launchIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val contentIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
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

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(Color.parseColor("#070B14")),
            navigationBarStyle = SystemBarStyle.dark(Color.parseColor("#070B14"))
        )
        super.onCreate(savedInstanceState)

        createHighPriorityNotificationChannel()
        askNotificationPermissionIfNeeded()
        scheduleMidnightWidgetReset(this)

        val container = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#070B14"))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            setBackgroundColor(Color.parseColor("#070B14"))
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                mediaPlaybackRequiresUserGesture = false
                cacheMode = WebSettings.LOAD_DEFAULT
            }
            addJavascriptInterface(AndroidBridge(), "AndroidBridge")
            addJavascriptInterface(WidgetBridge(this@MainActivity), "SystemWidget")
            webViewClient = WebViewClient()

            webChromeClient = object : WebChromeClient() {
                override fun onShowFileChooser(
                    webView: WebView?,
                    callback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?
                ): Boolean {
                    filePathCallback?.onReceiveValue(null)
                    filePathCallback = callback

                    val acceptTypes = fileChooserParams?.acceptTypes
                        ?.filter { it.isNotBlank() }
                        ?.toTypedArray()

                    val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "*/*"
                        if (!acceptTypes.isNullOrEmpty()) {
                            putExtra(Intent.EXTRA_MIME_TYPES, acceptTypes)
                        }
                    }

                    return try {
                        fileChooserLauncher.launch(Intent.createChooser(intent, "Pilih File"))
                        true
                    } catch (e: Exception) {
                        filePathCallback?.onReceiveValue(null)
                        filePathCallback = null
                        false
                    }
                }
            }
        }

        container.addView(webView)

        ViewCompat.setOnApplyWindowInsetsListener(container) { view, windowInsets ->
            val insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
            )
            view.updatePadding(
                left = insets.left,
                top = insets.top,
                right = insets.right,
                bottom = insets.bottom
            )
            WindowInsetsCompat.CONSUMED
        }

        setContentView(container)
        webView.loadUrl("file:///android_asset/index.html")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (this::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    companion object {
        const val ACTION_MIDNIGHT_WIDGET_RESET = "com.systemrpg.productivity.ACTION_MIDNIGHT_WIDGET_RESET"
        const val REQ_CODE_MIDNIGHT_RESET = 1099

        fun refreshAllAppWidgets(context: Context) {
            SystemStreakWidget.updateAllWidgets(context)
            SystemMiniStatsWidget.updateAllWidgets(context)
        }

        fun scheduleMidnightWidgetReset(context: Context) {
            try {
                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                val intent = Intent(context, ReminderReceiver::class.java).apply {
                    action = ACTION_MIDNIGHT_WIDGET_RESET
                }
                val pendingIntent = PendingIntent.getBroadcast(
                    context,
                    REQ_CODE_MIDNIGHT_RESET,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )

                alarmManager.cancel(pendingIntent)

                val cal = Calendar.getInstance().apply {
                    set(Calendar.HOUR_OF_DAY, 0)
                    set(Calendar.MINUTE, 1)
                    set(Calendar.SECOND, 0)
                    set(Calendar.MILLISECOND, 0)
                    if (timeInMillis <= System.currentTimeMillis()) {
                        add(Calendar.DAY_OF_YEAR, 1)
                    }
                }

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
                } else {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
                }
            } catch (_: Exception) {
            }
        }

        fun handleMidnightWidgetReset(context: Context) {
            try {
                val prefs = context.getSharedPreferences("SystemRpgWidgetPrefs", Context.MODE_PRIVATE)
                val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
                val lastUpdated = prefs.getString("lastUpdatedDate", "") ?: ""

                if (lastUpdated != todayStr) {
                    val prevDailyPct = prefs.getInt("dailyPct", 0)
                    var streak = prefs.getInt("streak", 0)
                    val oldHistory = prefs.getString("weekHistory", "0000000") ?: "0000000"
                    val threshold = prefs.getInt("dailyTargetPct", 70)

                    // Jika kemarin < threshold target, streak reset ke 0
                    if (prevDailyPct < threshold) {
                        streak = 0
                    }

                    val cal = Calendar.getInstance()
                    val isMonday = cal.get(Calendar.DAY_OF_WEEK) == Calendar.MONDAY
                    val newHistory = if (isMonday) {
                        "0000000"
                    } else {
                        val dow = cal.get(Calendar.DAY_OF_WEEK)
                        val todayIdx = if (dow == Calendar.SUNDAY) 6 else dow - 2
                        val chars = oldHistory.padEnd(7, '0').take(7).toCharArray()
                        if (todayIdx in 0..6) chars[todayIdx] = '0'
                        String(chars)
                    }

                    prefs.edit()
                        .putInt("streak", streak)
                        .putInt("dailyPct", 0)
                        .putString("weekHistory", newHistory)
                        .putString("lastUpdatedDate", todayStr)
                        .apply()

                    context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE).edit()
                        .putInt("pct", 0)
                        .putInt("dailyPct", 0)
                        .putInt("doneCount", 0)
                        .apply()

                    refreshAllAppWidgets(context)
                }
            } catch (_: Exception) {
            } finally {
                scheduleMidnightWidgetReset(context)
            }
        }

        fun scheduleExactAlarmsFromPrefs(context: Context) {
            scheduleMidnightWidgetReset(context)
            try {
                val prefs = context.getSharedPreferences("SystemRpgReminderPrefs", Context.MODE_PRIVATE)
                if (!prefs.getBoolean("enabled", false)) return

                val timesJson = prefs.getString("timesJson", "{}") ?: "{}"
                val pendingCount = prefs.getInt("pendingCount", 1)
                val playerName = prefs.getString("playerName", "Hunter") ?: "Hunter"

                val times = JSONObject(timesJson)
                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                val slots = listOf("Pagi" to 1001, "Sore" to 1002, "Malam" to 1003)

                for ((slotName, reqCode) in slots) {
                    val intent = Intent(context, ReminderReceiver::class.java).apply {
                        putExtra("slot", slotName)
                        putExtra("pendingCount", pendingCount)
                        putExtra("playerName", playerName)
                    }
                    val pendingIntent = PendingIntent.getBroadcast(
                        context,
                        reqCode,
                        intent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )

                    alarmManager.cancel(pendingIntent)

                    val timeStr = times.optString(slotName, "")
                    val parts = timeStr.split(":")
                    if (parts.size == 2) {
                        val hour = parts[0].toIntOrNull() ?: continue
                        val minute = parts[1].toIntOrNull() ?: continue

                        val cal = Calendar.getInstance().apply {
                            set(Calendar.HOUR_OF_DAY, hour)
                            set(Calendar.MINUTE, minute)
                            set(Calendar.SECOND, 0)
                            set(Calendar.MILLISECOND, 0)
                            if (timeInMillis <= System.currentTimeMillis()) {
                                add(Calendar.DAY_OF_YEAR, 1)
                            }
                        }

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
                        } else {
                            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pendingIntent)
                        }
                    }
                }
            } catch (_: Exception) {
            }
        }
    }
}
