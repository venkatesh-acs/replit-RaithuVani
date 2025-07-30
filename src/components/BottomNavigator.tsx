import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Capture from '../components/Capture';
import Issues from './IssuesListShow';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const homeimg = require('../assets/home.png');
const dashimg = require('../assets/issue.png');


const Tab = createBottomTabNavigator();

const BottomNavigator: React.FC = () => {
  const [usertype, setUserType] = useState<any>(null);
  console.log('usertype',usertype)
  const [loading, setLoading] = useState(true)
  const getUid = async () => {
    console.log('getuid Method called')
    try {
      console.log('entered try')
      const uid = await AsyncStorage.getItem('uid')
      const usertype = await AsyncStorage.getItem('usertype');
      console.log('uid_usertype',usertype)
      if(usertype){
        setUserType(usertype)
      }
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getUid()
  //   }, [])
  // )
  useEffect(() => {
    console.log('useEffect triggered');
    // getUid();
    const timer = setTimeout(() => {
      getUid();
    }, 2000);

    return () => clearTimeout(timer);
  }, []); 
  // useEffect(() => {
  //   if (usertype && usertype.length > 0) {
  //     getUid();
  //   }
  // }, [usertype]);
  const uType = 'farmer';
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }
  if (!usertype) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#694fad" />
      </View>
    );
  }
  return (
    <Tab.Navigator
      initialRouteName="homes"
      screenOptions={{
        tabBarActiveTintColor: '#694fad', // Label color for the active tab
        tabBarInactiveTintColor: 'gray', // Label color for inactive tabs
        tabBarStyle: {
          backgroundColor: '#ffffff', // Background color of the tab bar
        },
        headerShown: false, // Hide headers if not needed
      }}
    >
      {usertype === uType && (
        <Tab.Screen
          name="homes"
          component={Capture}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <Image
                source={homeimg}
                style={[styles.icon, focused && styles.activeIcon]}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="issues"
        component={Issues}
        options={{
          tabBarLabel: 'Issues',
          tabBarIcon: ({ focused }) => (
            <Image
              source={dashimg}
              style={[styles.icon, focused && styles.activeIcon]}
            />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginBottom: -3,
  },
  activeIcon: {
    transform: [{ scale: 1.1 }], // Slightly increase size for active icon
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default BottomNavigator;
