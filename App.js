/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import firebase from "react-native-firebase";
import type { Notification } from "react-native-firebase";

type Props = {};
export default class App extends Component<Props> {
  componentWillMount() {
    const channel = new firebase.notifications.Android.Channel(
      "tillion_channel",
      "tillion_channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("tillion pannel channel");
    firebase.notifications().android.createChannel(channel);
  }
  componentDidMount() {
    const notificationOpen: NotificationOpen = firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      console.warn("----------------------start notificationOpen");
      console.warn(notificationOpen);
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification: Notification = notificationOpen.notification;
      console.warn("----------------------end notificationOpen");
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
            .android.setSmallIcon("ic_launcher");
        }
        firebase.notifications().displayNotification(notification);

        console.warn("----------------------end onNotification");
      });
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        console.warn("----------------------start onNotificationOpened");
        console.warn(notificationOpen);
        const action = notificationOpen.action;
        // Get the action triggered by the notification being opened
        console.warn(action);
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
        console.warn("----------------------end onTokenRefresh");
      });
  }
  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }
  checkPushPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.warn("----------------------start checkPushPermission(enabled)");
      console.warn("user has permissions");
      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.warn(fcmToken);
        console.warn("user has a device token");
      } else {
        console.warn("user doesn`t have a device token yet");
      }
      console.warn("----------------------end checkPushPermission(enabled)");
    } else {
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
  render() {
    this.checkPushPermission();
    return Platform.select({
      ios: (
        <WebView
          ref={r => (this.webref = r)}
          useWebKit={true}
          allowsBackForwardNavigationGestures={true}
          style={{ marginTop: 30 }}
          source={{ uri: "http://218.147.200.173:18080/mobile" }}
          onMessage={event => {
            if (event.nativeEvent.data == "back") {
              this.webref.goBack();
            }
          }}
        />
      ),
      android: (
        <WebView source={{ uri: "http://218.147.200.173:18080/mobile" }} />
      )
    });
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
