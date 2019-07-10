
# react-native-ad-brix

## Getting started

`$ npm install react-native-ad-brix --save`

### Mostly automatic installation

`$ react-native link react-native-ad-brix`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-ad-brix` and add `RNAdBrix.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNAdBrix.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNAdBrixPackage;` to the imports at the top of the file
  - Add `new RNAdBrixPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-ad-brix'
  	project(':react-native-ad-brix').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-ad-brix/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-ad-brix')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNAdBrix.sln` in `node_modules/react-native-ad-brix/windows/RNAdBrix.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Ad.Brix.RNAdBrix;` to the usings at the top of the file
  - Add `new RNAdBrixPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNAdBrix from 'react-native-ad-brix';

// TODO: What to do with the module?
RNAdBrix;
```
  