import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigator from './src/components/BottomNavigator';
import Login from './src/starter/Login';
import LeftMenu from './src/accessories/LeftMenu';
import Support from './src/components/Support';
import AboutUs from './src/components/AboutUs';
import AppTour from './src/components/AppTour';
import EnvironmentSelect from './src/accessories/EnvironmentSelect';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import Capture from './src/components/Capture';
import Profile from './src/components/Profile';
import SolutionList from './src/components/SolutionList';
import SingleSolution from './src/components/SingleSolution';
import Search from './src/components/Search';
import Deactivate from './src/components/Deactivate';
import CancelDeactivate from './src/components/CancalDeactivate';
import Reactivate from './src/components/Reactivate';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const vidimg = require('./src/assets/icons-back.png');

interface AppDrawerProps {
  onLogout: () => void;
}
// const AppDrawer = () => (
const AppDrawer = ({ onLogout }: AppDrawerProps) => (
  <Drawer.Navigator drawerContent={(props) => <LeftMenu {...props} onLogout={onLogout} />}>

    <Drawer.Screen name="Home" component={BottomNavigator}
      options={({ navigation }) => ({
        title: 'RythuVani',
        headerTitleAlign:'center'
      })}
    />
    <Drawer.Screen name="Support1" component={Support}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'Contact Us', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
      <Drawer.Screen name="solutionsList" component={SolutionList}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'RythuVani', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
    <Drawer.Screen name="searchList" component={Search}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'RythuVani', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
     <Drawer.Screen name="singlesolutioncapture" component={Capture}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'RythuVani', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
      <Drawer.Screen name="singlesolutionsList" component={SingleSolution}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'RythuVani', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
    <Drawer.Screen name="Raithuvani" component={AppTour}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'RythuVani', // Optional: Set your screen title
        headerTitleAlign:'center'
      })}
    />
    <Drawer.Screen name="env" component={EnvironmentSelect} options={{ headerShown: false }} />
    <Drawer.Screen name="Aboutus" component={AboutUs}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'About Us',
        headerTitleAlign:'center'
      })}
    />
    <Drawer.Screen name="Capture" component={Capture} />
    <Drawer.Screen name="Profile" component={Profile}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        headerTitleAlign:'center',
        title: 'Profile',
      })}
    />
    <Drawer.Screen name="Deactivate"     
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'Deactivate/Deletion Account',
      })}
      initialParams={{ onLogout }}
    >
      {(props) => <Deactivate {...props} onLogout={onLogout} />}
      </Drawer.Screen>
    <Drawer.Screen name="canceldeactivate" component={CancelDeactivate}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 10 }}>
            <Image source={vidimg} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        ),
        title: 'Cancel Deletion/Deactivate account',
      })}
    />
  </Drawer.Navigator>
);
type RootStackParamist = {
  Login: undefined;
  BottomNavigator: undefined;
}
type LoginNavigationProp = StackNavigationProp<RootStackParamist, 'Login'>;

interface AuthStackProps {
  navigation?: LoginNavigationProp;
  onLogin: () => any;
}

const AuthStack = ({ navigation, onLogin }: AuthStackProps) => (
  <Stack.Navigator>
    <Stack.Screen name="login" component={() => <Login onLogin={onLogin} />} options={{ headerShown: false }} />
    <Stack.Screen name="env" component={EnvironmentSelect} options={{ headerShown: false }} />
    <Stack.Screen name="Support" component={Support}
      options={({ navigation }) => ({
        title: 'Contact Us',
      })}
    />
    <Stack.Screen name="reactivate" component={Reactivate}
      options={({ navigation }) => ({
        title: 'Reactivate',
      })}
    />
  </Stack.Navigator>
)

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("isLoggedIn", isLoggedIn)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const uid = await AsyncStorage.getItem('uid');
        console.log("loginuid", uid)
        if (uid) {
          console.log("enteredif", uid)

          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log('Error retrieving data:', e);

      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, [setIsLoggedIn,]);
  const handleLogin = () => {
    setIsLoggedIn(true)
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    // <NavigationContainer>
    //   <AppDrawer />

    // </NavigationContainer>
    <NavigationContainer>
      {isLoggedIn ? (
        <AppDrawer onLogout={handleLogout} />
      ) : (
        <AuthStack onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
};

export default App;