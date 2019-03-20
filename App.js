/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, WebView, View} from 'react-native';


type Props = {};
export default class App extends Component<Props> {
  render() {
    return ( Platform.select({ ios: <WebView style={{marginTop: 30}} source={{ uri : "http://218.147.200.173:18080/mobile"}} />,
    android : <WebView style={{marginTop: 30}} source={{ uri : "http://218.147.200.173:18080/mobile"}} />
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
