/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  BackHandler,
  Linking,
  PermissionsAndroid
} from "react-native";
import { WebView } from "react-native-webview";
import firebase from "react-native-firebase";
import type { Notification } from "react-native-firebase";
import SplashScreen from "react-native-splash-screen";
import RNKakaoLink from "react-native-kakao-link";

type Props = {};
const userFirebaseInfo = {};
const popupUrls = [
  //"mobile/my/point/inipay/start"
];
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      firebasePushToken: null,
      webviewUrl: ""
    };
  }
  componentWillMount() {
    this.checkPushPermission();
    userFirebaseInfo.firebaseDeviceType = Platform.OS;
    const channel = new firebase.notifications.Android.Channel(
      "tillion_channel",
      "tillion_channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("tillion pannel channel");
    firebase.notifications().android.createChannel(channel);
  }
  componentDidMount() {
    if (Platform.OS == "android") {
      BackHandler.addEventListener("hardwareBackPress", this.backHandler);
      this.requestCameraPermission();
    }
    const notificationOpen: NotificationOpen = firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      //console.warn("----------------------start notificationOpen");
      //console.warn(notificationOpen);
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      //console.warn("----------------------end notificationOpen");
    }
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        console.warn("----------------------start onNotificationDisplayed");
        console.warn("Process your notification as required");
        console.warn(notification);
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.warn("----------------------end onNotificationDisplayed");
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        console.warn("----------------------start onNotification");
        console.warn("Process your notification as required");
        console.warn(notification);
        if (Platform.OS == "android") {
          notification.android
            .setChannelId("tillion_channel")
            .android.setSmallIcon("ic_stat_noti");
        }
        if (Platform.OS === 'ios'){
          notification.ios.setBadge(0);
        }
        firebase.notifications().displayNotification(notification);

        console.warn("----------------------end onNotification");
      });
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        console.warn("----------------------start onNotificationOpened");
        console.warn(notificationOpen);
        if (notificationOpen.notification.data.url) {
          if (this.webref) {
            this.webref.injectJavaScript(
              "javascript:location.href='" +
                notificationOpen.notification.data.url +
                "'"
            );
          }
        }

        //const action = notificationOpen.action;
        // Get the action triggered by the notification being opened
        //console.warn(action);
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        console.warn(notification);
        console.warn("----------------------end onNotificationOpened");
      });
    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        console.warn("----------------------start onTokenRefresh");
        console.warn(fcmToken);
        if (this.webref) {
          userFirebaseInfo.firebasePushToken = fcmToken;
          console.warn(userFirebaseInfo.firebasePushToken);
          this.webref.injectJavaScript(
            `window.userFirebaseInfo = ` + JSON.stringify(userFirebaseInfo)
          );
        }

        console.warn("----------------------end onTokenRefresh");
      });
  }
  componentWillUnmount() {
    if (Platform.OS == "android") {
      BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
    }
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }
  backHandler = () => {
    if (this.webref) {
      if (
        this.state.webviewUrl.indexOf("?ref=") < 0 &&
        (this.state.webviewUrl.endsWith("/mobile") ||
          this.state.webviewUrl.endsWith("/mobile/") ||
          this.state.webviewUrl.endsWith("/mobile#") ||
          this.state.webviewUrl.endsWith("/mobile#/"))
      ) {
        Alert.alert(
          "잠깐!",
          "앱을 종료하시겠습니까?",
          [
            {
              text: "아니오",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "네",
              onPress: () => {
                BackHandler.exitApp();
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        this.webref.goBack();
      }
      return true;
    }
  };
  checkPushPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.warn("----------------------start checkPushPermission(enabled)");
      console.warn("user has permissions");
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.warn(fcmToken);
        console.warn("user has a device token");
        this.setState({
          firebasePushToken: fcmToken
        });
      } else {
        console.warn("user doesn`t have a device token yet");
        this.setState({
          firebasePushToken: ""
        });
      }
      console.warn("----------------------end checkPushPermission(enabled)");
    } else {
      this.setState({
        firebasePushToken: ""
      });
      console.warn("----------------------start checkPushPermission(!enabled)");
      try {
        await firebase.messaging().requestPermission();
        console.warn("User has authorised");
      } catch (error) {
        console.warn(error);
        console.warn("User has rejected permissions");
      }
      console.warn("----------------------end checkPushPermission(!enabled)");
    }
  };
  _onNavigationStateChange = webViewState => {
    this.setState({
      webviewUrl: webViewState.url
    });
    console.warn(webViewState.url);

    for (var i = 0; i < popupUrls.length; i++) {
      if (webViewState.url.indexOf(popupUrls[i]) > -1) {
        this.webref.stopLoading();
        console.warn(webViewState.url);
        Linking.openURL(webViewState.url);
      }
    }
    if (webViewState.url.indexOf("/poll/new") > -1) {
      if (Platform.OS == "android") {
        this.requestCameraPermission();
      }
    }
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "카메라 권한을 허가해주세요.",
          message: "투표 등록시 카메라 권한이 필요합니다.",
          buttonNegative: "아니오",
          buttonPositive: "네"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  render() {
    const webviewProps = Platform.select({
      ios: {
        useWebKit: true,
        allowsBackForwardNavigationGestures: false
      },
      android: {}
    });
    const webviewStyle = Platform.select({
      ios: {
        marginTop: 30
      },
      android: {}
    });
    userFirebaseInfo.firebasePushToken = this.state.firebasePushToken;
    //return this.state.firebasePushToken ? (
    return (
      <WebView
        {...webviewProps}
        style={webviewStyle}
        ref={r => (this.webref = r)}
        source={{
          //uri: "http://218.147.200.173:18080/mobile"
          //uri: "http://172.100.20.196:8090/mobile"
          //uri: "http://172.30.1.40:8080/mobile"
          //uri: "http://devweb.tillionpanel.com/mobile"
          uri: "https://www.tillionpanel.com/mobile"
        }}
        onNavigationStateChange={this._onNavigationStateChange}
        onMessage={event => {
          console.warn(event.nativeEvent.data);
          if (Platform.OS === "ios" && event.nativeEvent.data == "back") {
            this.webref.goBack();
          }
          if (event.nativeEvent.data.indexOf("*") > -1) {
            RNKakaoLink.link(
              event.nativeEvent.data.split("*")[0],
              event.nativeEvent.data.split("*")[1],
              event.nativeEvent.data.split("*")[2]
            );
            /*
            RNKakaoLink.link(
              result => {
                console.log(result);
              },
              event.nativeEvent.data.split("*")[0],
              event.nativeEvent.data.split("*")[1],
              event.nativeEvent.data.split("*")[2]
            );
            */
          }
        }}
        javaScriptEnabled={true}
        injectedJavaScript={
          `window.userFirebaseInfo = ` + JSON.stringify(userFirebaseInfo)
        }
        onLoadEnd={() => {
          SplashScreen.hide();
          console.warn("webview loadFinished!");
        }}
      />
    );
    /*
    ) : (
      <View />
    );
    */
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
