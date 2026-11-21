plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.systemrpg.productivity"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.systemrpg.productivity"
        minSdk = 23
        targetSdk = 35
        val runNumber = System.getenv("VERSION_CODE")?.toIntOrNull() ?: 1
        versionCode = runNumber
        versionName = "1.0.$runNumber"
    }

    signingConfigs {
        create("release") {
            storeFile = file("release-key.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS")
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        // Keep the experimental V7 debug app separate from a Hunter's installed V6.
        getByName("debug") {
            applicationIdSuffix = ".v7preview"
            versionNameSuffix = "-v7preview"
        }
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
        }
    }
}


dependencies {
    implementation("androidx.activity:activity-ktx:1.10.0")
}
