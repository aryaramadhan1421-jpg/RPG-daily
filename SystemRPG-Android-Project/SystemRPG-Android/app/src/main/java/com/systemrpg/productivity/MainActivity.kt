package com.systemrpg.productivity

import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import java.io.IOException

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var pendingBackup: ByteArray? = null
    private var pendingBackupName: String = "system-rpg-backup.json"

    private val createBackup = registerForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
        if (uri != null) {
            try {
                contentResolver.openOutputStream(uri)?.use { output ->
                    pendingBackup?.let(output::write)
                }
                webView.evaluateJavascript("window.spawnFloatingReward && window.spawnFloatingReward('\\u2705 Backup berhasil disimpan!');", null)
            } catch (_: IOException) {
                webView.evaluateJavascript("window.spawnFloatingReward && window.spawnFloatingReward('\\u274c Gagal menyimpan backup');", null)
            }
        }
        pendingBackup = null
    }

    private val openBackup = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        val callback = fileChooserCallback
        fileChooserCallback = null
        callback?.onReceiveValue(if (uri != null) arrayOf(uri) else null)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
            mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }
        webView.addJavascriptInterface(AndroidBridge(), "AndroidBridge")
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return url == null || !url.startsWith("file:///android_asset/")
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.fileChooserCallback?.onReceiveValue(null)
                this@MainActivity.fileChooserCallback = filePathCallback
                return try {
                    openBackup.launch(arrayOf("application/json", "text/json", "text/plain"))
                    true
                } catch (_: Exception) {
                    this@MainActivity.fileChooserCallback = null
                    false
                }
            }
        }
        webView.loadUrl("file:///android_asset/index.html")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })
    }

    private inner class AndroidBridge {
        @JavascriptInterface
        fun saveBackup(base64: String, filename: String) {
            try {
                pendingBackup = Base64.decode(base64, Base64.DEFAULT)
                pendingBackupName = filename.substringAfterLast('/').ifBlank { "system-rpg-backup.json" }
                runOnUiThread { createBackup.launch(pendingBackupName) }
            } catch (_: Exception) {
                runOnUiThread {
                    webView.evaluateJavascript("window.spawnFloatingReward && window.spawnFloatingReward('\\u274c Gagal menyiapkan backup');", null)
                }
            }
        }
    }

    override fun onDestroy() {
        fileChooserCallback?.onReceiveValue(null)
        webView.removeJavascriptInterface("AndroidBridge")
        webView.destroy()
        super.onDestroy()
    }
}
