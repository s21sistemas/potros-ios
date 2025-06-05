import withFixedFirebaseModularHeaders from "./expo-plugins/withFixedFirebaseModularHeaders";

export default {
  expo: {
    name: "ClubPotros",
    slug: "potrosclub",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logoPotros.jpg",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    permissions: [
      "CAMERA",
      "MEDIA_LIBRARY"
    ],
    splash: {
      image: "./assets/logoPotros.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    fonts: [
      {
        name: "MiFuente",
        file: "./assets/fonts/MiFuente.ttf"
      }
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mx.s1sistem.ClubPotros",
      icon: "./assets/logoPotros.jpg",
      buildNumber: "3.0.0",
      usesAppleSignIn: true,
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Permite acceder a tus fotos para subir imágenes",
        NSCameraUsageDescription: "Permite tomar fotos para subir a la aplicación",
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.mx.s1sistem.ClubPotros",
      
      adaptiveIcon: {
        foregroundImage: "./assets/potrosIcon.png",
        backgroundColor: "#ffffff"
      },
      icon: "./assets/potrosIcon.png",
      permissions: [
        "android.permission.USE_BIOMETRIC",
        "android.permission.USE_FINGERPRINT"
      ]
    },
    web: {
      favicon: "./assets/potrosIcon.png"
    },
    extra: {
      eas: {
        projectId: "c195b41a-aaf0-45e4-b072-361dcfa3a22a"
      }
    },
    owner: "reapervic",
    plugins: [
      "expo-signature",
      withFixedFirebaseModularHeaders // <- referencia directa al plugin
    ]
  }
};
