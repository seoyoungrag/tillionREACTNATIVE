/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import { WebView } from "react-native-webview";


type Props = {};
export default class App extends Component<Props> {
  render() {
    return ( Platform.select({ ios: 
    <WebView 
      ref={r => (this.webref = r)}
      useWebKit={true} 
      allowsBackForwardNavigationGestures={true} 
      style={{marginTop: 30}} 
      source={{ uri : "http://218.147.200.173:18080/mobile"}} 
      onMessage={event => {
        if(event.nativeEvent.data=='back'){
          this.webref.goBack();
        }

      }}
    />,
    android : 
    <WebView 
    source={{ uri : "http://218.147.200.173:18080/mobile"}} 
    />
    })
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
