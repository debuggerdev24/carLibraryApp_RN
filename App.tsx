
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Platform, Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import CarLibrary from './src/screens/CarLibrary';

// Enable react-native-screens for performance
enableScreens();

// Define navigation types
type RootTabParamList = {
  Home: undefined;
  Library: undefined;
  Profile: undefined;
};

// Sample screen components
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text>Home Screen</Text>
  </View>
);

const LibraryScreen = () => (
  <View style={styles.screen}>
    <Text>Library Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screen}>
    <Text>Profile Screen</Text>
  </View>
);

// Custom Tab Bar (based on React Navigation docs)
function MyTabBar({ state, descriptors, navigation }) {
  return (
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Library'
              ? 'directions-car'
              : 'person-outline';

          return (
            <PlatformPressable
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              <Icon
                name={iconName}
                size={24}
                color={isFocused ? '#A076F2' : 'rgba(255,255,255,0.6)'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#A076F2' : 'rgba(255,255,255,0.6)' },
                ]}
              >
                {label === 'Library' ? 'Car Library' : label}
              </Text>
            </PlatformPressable>
          );
        })}
      </View>
  );
}

// Create the Tab Navigator
const Tab = createBottomTabNavigator<RootTabParamList>();

const App = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
    <SafeAreaProvider>
      <NavigationContainer>
<Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarHideOnKeyboard: true, // Prevents hiding on keyboard (Android)
    keyboardHidesTabBar: false, // Prevents moving up (iOS)
    tabBarStyle: {
      backgroundColor: '#000',
      borderTopColor: 'transparent',
      height: 60,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      elevation: 0, // Removes Android shadow
      zIndex: 999, // Ensures tab bar stays on top
    },
  }}
  tabBar={(props) => <MyTabBar {...props} />}
>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ tabBarAccessibilityLabel: 'Home Tab' }}
          />
          <Tab.Screen
            name="Library"
            component={CarLibrary}
            options={{ tabBarAccessibilityLabel: 'Library Tab' }}
          />
          <Tab.Screen
            name="Services"
            component={ProfileScreen}
            options={{ tabBarAccessibilityLabel: 'Profile Tab' }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ tabBarAccessibilityLabel: 'Profile Tab' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
 screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderTopColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 4 : 2,
    width: 30,
    height: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});

export default App;