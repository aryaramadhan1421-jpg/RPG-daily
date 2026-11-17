package com.systemrpg.productivity

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        bridge?.webView?.let { webView ->
            webView.settings.javaScriptEnabled = true
            webView.addJavascriptInterface(WidgetBridge(this), "AndroidWidget")
        }
    }
}
