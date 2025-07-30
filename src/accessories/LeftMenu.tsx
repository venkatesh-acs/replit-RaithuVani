import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Share, Alert, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import { Linking } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { Divider } from 'react-native-paper';
const camimg = require('../assets/gfn/cog.png');
const caplogimg = require('../assets/gfn/ic_launcher.png');
const abtus = require('../assets/gfn/list.png');
const atour = require('../assets/gfn/apps.png');
const share = require('../assets/gfn/share.png');
// const contact = require('../assets/gfn/emerg_icon.png');
const contact = require('../assets/gfn/emailus.png');
const logs = require('../assets/gfn/logout.png');
const loimg = require('../assets/gfn/textlogo.png');
const proimg = require('../assets/gfn/user.png');
const passimg = require('../assets/gfn/password.png');
const delimg = require('../assets/gfn/deletes.png');
const candelimg = require('../assets/gfn/users.png');
const deldac = require('../assets/gfn/delete-2.png');

interface LeftMenuProps extends DrawerContentComponentProps {
  onLogout: () => void;
}
// const LeftMenu: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
const LeftMenu: React.FC<LeftMenuProps> = ({ navigation, onLogout, }) => {
  // const [deletetype, setDeleteType] = useState<any>('');
  const [deletetype, setDeleteType] = useState<string | null>(null);
  console.log("deletetypes", deletetype);

  useEffect(() => {
    fetchMonitorDisplay();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMonitorDisplay();
    }, [])
  );


  // useEffect(() => {
  const fetchMonitorDisplay = async () => {
    const deletetype = await AsyncStorage.getItem('deletionType') as any;
    // Alert.alert(deletetype);
    console.log("deletetypes", deletetype);

    console.log("deletetypes", deletetype);
    if (deletetype === 'permanent' || deletetype === 'temporary') {
      setDeleteType(deletetype);
      // console.log("deletetypes", deletetype);
    } else {
      setDeleteType('no');
      // console.log("deletetypes", setDeleteType('no'));
    }
  };

  // }, []);
  useEffect(() => {
    const fetchDeleteType = async () => {
        const deletetype = await AsyncStorage.getItem('deletionType');
        setDeleteType(deletetype);
    };

    // Fetch initially
    fetchDeleteType();

    // Poll every 2 seconds for updates
    const interval = setInterval(fetchDeleteType, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
}, []);

  const handleLogout = async () => {
    try {
      // Remove the 'uid' or any authentication token from AsyncStorage
      await AsyncStorage.removeItem('uid');
      await AsyncStorage.removeItem('selected_issue');
      await AsyncStorage.removeItem('selected_solution');
      await AsyncStorage.removeItem('selected_solution_id');


      onLogout()

      // Ensure navigation is properly reset
      // if (navigation.reset) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
      // } else {
      //   console.warn("navigation.reset is not available. Ensure you are using the right version of react-navigation.");
      // }
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };
  const opensett = async () => {
    if (Platform.OS === 'ios') {
      openSettings().catch(() => console.warn('cannot open settings'));
    } else {
      Linking.openSettings();
    }
  }


  const onShare = async () => {
    try {
      const message = Platform.select({
        ios: 'Please install this app and stay safe. AppLink: https://apps.apple.com/us/app/Rythuvani/6741690264', // Replace with your iOS App ID
        android: 'Please install this app and stay safe. AppLink: https://play.google.com/store/apps/details?id=acs.com.raithuvani&pcampaignid=web_share',
        default: 'Please install this app and stay safe.', // Fallback message
      });

      const url = Platform.select({
        ios: 'https://apps.apple.com/us/app/Rythuvani/6741690264', // Replace with your iOS App ID
        android: 'https://play.google.com/store/apps/details?id=acs.com.raithuvani&pcampaignid=web_share',
        default: 'https://play.google.com/store/apps/details?id=acs.com.raithuvani&pcampaignid=web_share',
      });

      const result = await Share.share({
        title: 'App link',
        message: message,
        url: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
      // Optionally show an alert
      // Alert.alert(error.message);
    }
  };



  return (
    <>
      <ScrollView>
        <View style={{ backgroundColor: 'blue', }}>
          <Image source={caplogimg} style={{ width: 180, height: 60, marginTop: 5, marginLeft: 5, }} resizeMode="stretch" />
          <Text style={{ marginLeft: 10, fontSize: 25, color: 'white', marginTop: 5 }}>RythuVani</Text>

        </View>
        <View style={styles.menu}>


          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Support1')}>
            <Image source={contact} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onShare}>
            <Image source={share} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Share App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Raithuvani')}>
            <Image source={atour} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Walkthrough App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
            <Image source={proimg} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          <Divider />
          <Divider />
          <Divider />
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Aboutus')}>
            <Image source={abtus} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={opensett}>
            <Image source={camimg} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          {(deletetype !== 'permanent' && deletetype !== 'temporary') && (

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Deactivate')}>
              <Image source={deldac} style={styles.imgstyle} />
              <Text style={styles.menuItemText}>Deactivate/Deletion</Text>
            </TouchableOpacity>
          )}
          {(deletetype === 'permanent' || deletetype === 'temporary') && (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('canceldeactivate')}>
              <Image source={candelimg} style={styles.imgstyle} />
              <Text style={styles.menuItemText}>Cancel Deactivate</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Image source={logs} style={styles.imgstyle} />
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'white',
    // padding: 30,
    marginTop: 0,
    marginLeft: 30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10

  },
  menuItem: {
    paddingVertical: 7,
    flexDirection: "row",
    marginTop: 5
  },
  menuItemText: {
    fontSize: 20,
    color: 'black',
    marginTop: 10
  },
  imgstyle: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: -20
  }
});

export default LeftMenu;
