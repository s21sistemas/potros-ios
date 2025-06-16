export default {
  expo: {
    name: "ClubPotros",
    slug: "potros-app-dev",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/logoPotros.jpg",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/logoPotros.jpg",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mx.s1sistem.ClubPotros",
      buildNumber: "2.0.5",
      icon: "./assets/logoPotros.jpg",
      deploymentTarget: "15.1",
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        UIDeviceFamily: [1, 2],
        UISupportedInterfaceOrientations: [
          "UIInterfaceOrientationPortrait",
          "UIInterfaceOrientationPortraitUpsideDown"
        ],
        "UISupportedInterfaceOrientations~ipad": [
          "UIInterfaceOrientationPortrait",
          "UIInterfaceOrientationPortraitUpsideDown",
          "UIInterfaceOrientationLandscapeLeft",
          "UIInterfaceOrientationLandscapeRight"
        ],
        NSPhotoLibraryUsageDescription: "Permite acceder a tus fotos para subir imágenes",
        NSCameraUsageDescription: "Permite tomar fotos para subir a la aplicación"
      }
    },
    android: {
      package: "com.mx.s1sistem.ClubPotros"
    },
    extra: {
      eas: {
        projectId: "96646753-98e0-46cc-b89d-e81c771fccb1"
      }
    },
    owner: "s21sistemas"
  }
};