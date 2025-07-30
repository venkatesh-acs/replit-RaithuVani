import React, { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, ImageBackground, PermissionsAndroid, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LoginService } from '../service/LoginService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS, requestMultiple, check } from 'react-native-permissions';
// import Location from 'react-native-location';

import Geolocation from 'react-native-geolocation-service';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dialog, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const imagename = require('../assets/gfn/splash.jpg');
const caplogimg = require('../assets/gfn/raithu_logo.png');
const pimg = require('../assets/gfn/circle_logo.png');
const emailimg = require('../assets/gfn/ic_email.png');
const keyimg = require('../assets/gfn/ic_key.png');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LoginProps {
  onLogin: () => string;
}
const Login = ({ onLogin }: LoginProps) => {
  // const Login: React.FC = () => {
  const [email, setEmail] = useState<any>('');
  const [phone, setPhone] = useState<any>('');
  const [isChecked, setIsChecked] = useState(false);
  const [thumbnailUri, setThumbNail] = useState(null);
  const [checkeddialog, setckeckedDialogVisible] = useState(false);
  const [opendialog, setOpenDialogterms] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [password, setPassword] = useState<any>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState<any>(null);
  const [openDialog, setDialog] = useState<any>(null);
  const [showPasswordEnv, setShowPasswordEnv] = useState(false);

  // Function to handle phone press
  const handlePhoneChange = (text: any) => {
    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');

    // Only allow up to 10 digits
    if (numericText.length <= 10) {
      // setPhone(numericText);
    }
  };

  const opendialogterms = async () => {
    setOpenDialogterms(true)
  }
  const [currentLat, setLat] = useState('')
  const [currentLong, setLong] = useState('')
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [storagepermissions, setStoragePermission] = useState<boolean | null>(null);


  useEffect(() => {
    requestLocationPermission();
    requestStoragePermission();
    requestcallPermission();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getSatateDropdown();
    }, [])
  );


  const navigation = useNavigation<any>();

  const toggleSwitch = () => {
    setShowPassword(previousState => !previousState);
  };

  const storeData = async (res: any) => {
    try {

      await AsyncStorage.setItem('uid', res.uid);
      // await AsyncStorage.setItem('email', res.email);
      await AsyncStorage.setItem('name', res.name);
      await AsyncStorage.setItem('usertype', res.usertype);
      await AsyncStorage.setItem('deletionType', res.deletionType);

    } catch (e) {
      console.log('Error while saving data:', e);
    }
  };

  const handleLogin = async () => {
    if (locationPermission === false && storagepermissions === false) {
      Alert.alert('Permission Required', 'Location permission is required to proceed.');
      requestLocationPermission();
      requestStoragePermission();
      return;
    }
    const countrycode = await AsyncStorage.getItem('countrycode');
    const apiname = 'ws_login.php';
    const payload = { email: email, password: password, countrycode: countrycode };

    console.log('payload_login', payload)
    try {
      if (email && password) {
        const res = await LoginService.getData(apiname, payload);
        console.log("login-res", res)
        if (res.uid) {
          // setIsLoggedIn(true)
          storeData(res)
          onLogin()

          navigation.navigate('Raithuvani');

        } else if (res.error_msg = "Login credentials are wrong. Please try again!") {
          Alert.alert('"Login credentials are wrong. Please try again!');
        } else if (res.email = "admin@gmail.com") {
          Alert.alert('Admin Login Unavailable. Only user login is accessible at this time.');
        }
        else {
          Alert.alert('Please Check your Credentials');
        }
      } else {
        Alert.alert('Please Enter Your Credentials correctly')
      }

    } catch (error) {
      // Alert.alert('Login Error', 'An error occurred during login');
    }
  };

  // Request location permission on component mount
  const requestLocationPermission = async () => {

    try {
      let permission;
      if (Platform.OS === 'ios') {
        // ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,

        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      console.log("permission", permission);

      if (permission === RESULTS.GRANTED) {
        console.log('Location permission granted');
        setLocationPermission(true);
        // Get the location values
        getLocation();
      } else {
        console.log('Location permission denied');
        setLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
      setLocationPermission(false);
    }
    requestcallPermission()
  };
  //Request storage permissions
  async function requestcallPermission() {
    if (Platform.OS === 'android') {
      try {
        const result = await requestMultiple([
          PERMISSIONS.ANDROID.RECORD_AUDIO,
          PERMISSIONS.ANDROID.CALL_PHONE,
          PERMISSIONS.ANDROID.READ_PHONE_STATE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ]);
        console.log('result', result);
      } catch (err) {
        console.warn(err);
      }
    };
    getLocation();

    requestCameraPermission();

  };
  //camera permissions
  async function requestCameraPermission() {
    try {
      let permission;
      if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.CAMERA;
      } else {
        permission = PERMISSIONS.ANDROID.CAMERA;
      }

      // Check current permission status
      const status = await check(permission);
      if (status === RESULTS.GRANTED) {
        console.log('You already have camera permission');
        setCameraPermission(true);
      } else {
        // Request permission
        const result = await request(permission, {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (result === RESULTS.GRANTED) {
          console.log('You can use the camera');
          setCameraPermission(true);
        } else {
          console.log('Camera permission denied');
          setCameraPermission(false);
        }
      }
    } catch (err) {
      console.warn(err);
      setCameraPermission(false);
    }
  }
  async function requestStoragePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },

        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
          setStoragePermission(true)
        } else {
          console.log('Storage permission denied');
          setStoragePermission(false)

        }
      } catch (err) {
        console.warn(err);
        setStoragePermission(false)

      }
    } else if (Platform.OS === 'ios') {
      // For iOS, you typically don't need to request permissions at runtime for file access.
      // However, check the `react-native-permissions` documentation for iOS-specific permissions if needed.
    }
    requestcallPermission();

  }
  const getLocation = () => {

    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        showposition(position)
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };
  const showposition = async (position: any) => {
    console.log("showposition:   is called")

    const currentLat = position.coords.latitude;
    const currentLong = position.coords.longitude;

    await AsyncStorage.setItem('latitude', currentLat.toString());
    await AsyncStorage.setItem('longitude', currentLong.toString());

    // if (currentLong) {
    //   const mylocation = false;
    //   getData(currentLat, currentLong);
    //   console.log("entered if in showpposition:   is called")
    // }
    if (currentLong) {
      // Fetch geocode data
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLat},${currentLong}&key=AIzaSyBUK8sY83sV1sp2T3GEyOPUln-lOlgUx94`);
      const responseJson = await response.json();
      // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
      if (responseJson.results.length > 0) {
        const result = responseJson.results[0];
        const address = result.formatted_address || '';
        const addressComponents = result.address_components;
        let city = '';
        let state = '';
        let district = '';
        let country = '';
        let countryCode = '';
        let postalCode = '';
        let knownName = '';
        let stateCode = '';

        addressComponents.forEach((component: any) => {
          const types = component.types;
          if (types.includes('sublocality_level_1')) {
            city = component.long_name;
          }
          if (city == '') {
            if (types.includes('locality')) {
              city = component.long_name;
            }
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
            stateCode = component.short_name;
          }
          if (types.includes('administrative_area_level_2')) {
            district = component.long_name;
          }
          if (types.includes('country')) {
            country = component.long_name;
            countryCode = component.short_name;
          }
          if (types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (types.includes('point_of_interest')) {
            knownName = component.long_name;
          }
        });
        for (const result of responseJson.results) {
          const addressComponents = result.address_components;
          // Log address components to inspect
          // console.log('Address Components:', addressComponents);

          addressComponents.forEach((component: any) => {
            const types = component.types;
            if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });
          // If we found a postal code, break out of the loop
          if (postalCode) {
            break;
          }
        }
        // Store address components in AsyncStorage
        await AsyncStorage.setItem('countryname', country);
        await AsyncStorage.setItem('countrycode', countryCode);
        await AsyncStorage.setItem('statename', state);
        // setNeed(state)
        await AsyncStorage.setItem('city', city);
        await AsyncStorage.setItem('zipcode', postalCode);
        console.log('postalCode', postalCode)
        await AsyncStorage.setItem('address', address);
        await AsyncStorage.setItem('districtname', district);
      }
    }
    setLong(currentLong);
    setLat(currentLat);
  }
  //To get data and set values in services
  const getData = async (currentLat: any, currentLong: any) => {
    console.log("getData:   is called")
    const apiname = 'ws_an_dataconnition.php';
    const payload = { latitude: currentLat, longitude: currentLong }
    console.log("data_payload", payload)
    const dataval = await LoginService.getData(apiname, payload);
    if (dataval) {
      const countryname = dataval[0].country;
      const countrycodes = dataval[0].country_code;
      console.log("headcountrycode", countrycodes)
      const statename = dataval[0].province
      console.log("headstate", statename)
      const districtname = dataval[0].sublocality
      const city = dataval[0].city
      const zipcode = dataval[0].postal_code
      const address = dataval[0].formatted_address
      // const address = dataval[0].plus_code?.compound_code || null;
      await AsyncStorage.setItem('countryname', countryname);
      await AsyncStorage.setItem('countrycode', countrycodes);
      await AsyncStorage.setItem('statename', statename);
      await AsyncStorage.setItem('city', city);
      await AsyncStorage.setItem('zipcode', zipcode);
      await AsyncStorage.setItem('address', address);
      await AsyncStorage.setItem('districtname', districtname);

    }
  };
  //To select Environment development/val/production
  const env = async () => {
    setDialog(true)
    // navigation.navigate('env');
  }
  const openLink = (url: any) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const register = async () => {
    // if(isChecked){
    if (email && selectedSub && need && district && phone && mandal) {
      console.log('entered if')
      const apiname = 'ws_register.php';
      const payload = { name: email, usertype: selectedSub, phone: phone, state: need, district: district, mandal: mandal };
      // const payload = { name: "email", usertype: "Farmer", phone: "989898989", state: "ANdhra Pradesh", district: "Krishna", mandal: "Gudivda" };
      console.log("ws_register_payload", payload)
      try {
        const res = await LoginService.getData(apiname, payload);
        console.log(res)
        if (res.uid) {
          setIsLoggedIn(true)
         await storeData(res)
          onLogin()
          await navigation.navigate('Home');

        } else {
          Alert.alert('Login Error', res.error_msg || 'Unknown error');
        }
      } catch (error) {
        // Alert.alert('Login Error', 'An error occurred during login');
      }
    } else {
      Alert.alert(
        '',
        'Please fill all the details',
        [{ text: 'OK' }]
      );
      // Alert.alert('Please fill all the details')
    }

  };
  const support = async () => {
    navigation.navigate('Support' as never);
  };
  const [openSub, setOpenSub] = useState(false); // Manages dropdown visibility
  const [selectedSub, setSelectedSub] = useState(null); // Stores the selected value
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropData, setDropData] = useState<any>([]);
  console.log("dropdata", dropData)
  const [open, setOpen] = useState(false);
  const [need, setNeed] = useState<any>(null);
  const [districtdropdown, setDistDropdown] = useState<string | null>(null);
  const [distdropData, setdistDropData] = useState<any>([]);
  const [opendist, setOpendist] = useState(false);
  const [district, setDistrict] = useState<any>(null);
  const [mandaldropData, setmandalDropData] = useState<any>([]);
  const [openmandal, setOpenmandal] = useState(false);
  const [mandal, setMandal] = useState<any>(null);

  const [subCategoryData, setSubCategoryData] = useState([
    { label: 'Farmer', value: 'farmer' },
    { label: 'Representative', value: 'representative' },
  ]); // Array of items for the dropdown

  // useEffect(()=>{
  //  const  getState = async () => {
  //  const state =  await AsyncStorage.getItem('statename');
  //  setNeed(state)
  //  }
  //  getState()
  // },[need,])
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  // const toggleDropdown = (dropdown: string) => {
  //   setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  // };
  // useEffect(() => {
  //   getSatateDropdown();
  // }, [])

  const getSatateDropdown = async () => {
    const apiname = 'ws_state.php';
    console.log('usertype-apiname', apiname)
    //  const countryid = await AsyncStorage.getItem('uid')
    const payload = { countryid: '1' };
    console.log("Need payload", payload)
    const res = await LoginService.getData(apiname, payload);
    console.log('usertypres', res.statearray);

    if (res) {
      const formattedData = res.statearray.map((item: { stateid: string, statename: string }) => ({
        label: item.statename,
        value: item.stateid,
      }));
      console.log('formattedData', formattedData);
      setDropData(formattedData);
    } else {
      console.error('No user types found');
    }
    getDistrictDropdown();
  };
  const getDistrictDropdown = async () => {
    const apiname = 'ws_reg_district.php';
    console.log('usertype-apiname', apiname)
    // const countryid = await AsyncStorage.getItem('uid')
    const payload = { stateid: need };
    console.log("Need district payload", payload)
    const res = await LoginService.getData(apiname, payload);
    console.log('userdistrictnames', res);

    if (res) {
      const formattedData = res.districtarray.map((item: { districtid: string, districtname: string }) => ({
        label: item.districtname,
        value: item.districtid,
      }));
      console.log('formattedData', formattedData);
      setdistDropData(formattedData);
    } else {
      console.error('No user types found');
    }
    getMandalDropdown();
  };

  const getMandalDropdown = async () => {
    const apiname = 'ws_reg_mandal.php';
    console.log('usertype-apiname', apiname)
    const countryid = await AsyncStorage.getItem('uid')
    const payload = { districtid: district };
    console.log("Need payload", payload)
    const res = await LoginService.getData(apiname, payload);
    console.log('mandal array', res);

    if (res) {
      const formattedData = res.mandalarray.map((item: { mid: string, mandalname: string }) => ({
        label: item.mandalname,
        value: item.mid,
      }));
      console.log('formattedData', formattedData);
      setmandalDropData(formattedData);
    } else {
      console.error('No user types found');
    }
  };
  // Close other dropdowns when one is opened
  const handleDropdownOpen = (current: any) => {
    setOpenSub(current === "sub");
    setOpen(current === "state");
    setOpendist(current === "district");
    setOpenmandal(current === "mandal");
  };

  const handleCheckboxPress = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    // Show or hide the dialog based on the new checked state
    // setCheckedDialogVisible(newCheckedState);
  };
  useEffect(() => {
    if (need) {
      getDistrictDropdown();
    }
  }, [need]);
  useEffect(() => {
    if (district) {
      getMandalDropdown();
    }
  }, [district]);

  //GeneratePassword
  const generatePassword = async () => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `rai${month}${year}`
  }
  const handleAdd = async () => {
    const currnetPassword = await generatePassword();
    console.log('currnetPassword', currnetPassword.trim())
    console.log('passwords', passwords)

    if (currnetPassword === passwords) {
      navigation.navigate('env' as never);
    } else {
      Alert.alert('Error', 'Invalid password! Please try again.')
    }
    setPasswords(null);
    setDialog(false)
  }
  const closedialog = async () => {
    setDialog(false)
  }
  const toggleSwitch1 = () => {
    setShowPasswordEnv((prevState) => !prevState);
  };
  const reactivate = () => {
    navigation.navigate('reactivate' as never);
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={imagename} style={styles.image}>
        <TouchableOpacity onPress={env} style={{ alignItems: 'center', marginTop: -40 }}>
          <Text style={styles.buttonText1}>.</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={caplogimg} style={styles.centeredImage} />
        </View>
        {/* Side-by-side Containers */}
        <View style={styles.rowContainer}>
          {/* First Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              style={styles.textInput}
              placeholder="Fullname"
              placeholderTextColor="black"
              autoCapitalize='none'
              value={email}
            />


            <DropDownPicker
              open={openSub}
              value={selectedSub}
              items={subCategoryData}
              setOpen={() => handleDropdownOpen("sub")}
              setValue={(value) => {
                setSelectedSub(value);
                setOpenSub(false); // Close dropdown after selection
              }}
              dropDownContainerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              placeholder="Select Type"
              zIndex={4000}
              onClose={() => setOpenSub(false)} // Ensure dropdown closes properly
            />
            <DropDownPicker
              open={opendist}
              value={district}
              items={distdropData}
              setOpen={() => handleDropdownOpen("district")}
              setValue={(value) => {
                setDistrict(value);
                setOpendist(false); // Close dropdown after selection
                getMandalDropdown()
              }}
              //  setOpen={setOpendist}
              // setValue={setDistrict}
              setItems={setdistDropData}
              placeholder="Select a District"
              dropDownContainerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              zIndex={2000}
              onClose={() => setOpendist(false)}
            />

          </View>
          {/* Second Input Container */}
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => setPhone(text)}
              style={styles.textInput}
              placeholder="Phone"
              placeholderTextColor="black"
              autoCapitalize='none'
            />
            <DropDownPicker
              open={open}
              value={need}
              items={dropData}
              setOpen={() => handleDropdownOpen("state")}
              setValue={(value) => {
                setNeed(value);
                setOpen(false); // Close dropdown after selection
                getDistrictDropdown()
              }}
              // setOpen={setOpen}
              // setValue={setNeed}
              setItems={setDropData}
              dropDownContainerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              placeholder="Select a State"
              zIndex={3000}
              onClose={() => setOpen(false)}
            />

            <DropDownPicker
              open={openmandal}
              value={mandal}
              items={mandaldropData}
              // setOpen={setOpenmandal}
              setOpen={() => handleDropdownOpen("mandal")}
              setValue={(value) => {
                setMandal(value);
                setOpenmandal(false); // Close dropdown after selection
              }}
              // setValue={setMandal}
              setItems={setmandalDropData}
              placeholder="Select a Mandal"
              dropDownContainerStyle={styles.dropdownContainer}
              style={styles.dropdown}
              zIndex={1000}
              onClose={() => setOpenmandal(false)}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <>
            <BouncyCheckbox style={{ borderColor: 'black', marginLeft: 30, marginTop: -10 }} isChecked={isChecked} unFillColor='white' fillColor='blue'
              onPress={handleCheckboxPress}
            />
            <Text style={styles.link} onPress={() => openLink('https://rythuvani.dinkhoo.com/terms_and_conditions.html')}>Terms and Conditions </Text>

          </>
        </View>
        <TouchableOpacity onPress={register} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={support} >
          <Text style={{ fontSize: 30, alignSelf: 'center', color: 'white', fontWeight: 'bold', textDecorationLine: 'underline' }}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reactivate} >
          <Text style={{ fontSize: 30, alignSelf: 'center', color: 'white', fontWeight: 'bold', textDecorationLine: 'underline' }}>Reactivate Account</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={env} style={{ alignItems: 'center',marginTop:10 }}>
          <Text style={styles.buttonText1}>.</Text>
        </TouchableOpacity> */}
      </ImageBackground>

      <Dialog visible={openDialog} style={{ zIndex: 10, marginTop: 10, margin: 60 }} >
        <View>
          <Text style={styles.heading1}>Enter Password</Text>
          <TextInput
            style={styles.inputcss}
            placeholder="Enter Password"
            value={passwords}
            onChangeText={setPasswords}
            placeholderTextColor='black'
            secureTextEntry={!showPasswordEnv}
            autoCapitalize='none'
          />

          <View style={styles.checkboxContainer}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={showPasswordEnv ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch1}
              value={showPasswordEnv}
            />
            <Text style={styles.label}>Show Password</Text>
          </View>
          <View style={styles.dialogContent}>
            <TouchableOpacity style={styles.ovalButton2} onPress={handleAdd}>
              <Text style={styles.buttonTexts1}>Ok</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ovalButton3} onPress={closedialog}>
              <Text style={styles.buttonTexts1}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: -200,
  },
  link: {
    color: "white",
    textDecorationLine: "underline",
    marginBottom: 20, // Add spacing between link and button
    fontSize: 20,
    textAlign: "center",
    fontWeight: 'bold'
  },
  buttonContainer: {
    backgroundColor: "#6F8FAF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '75%',
    marginLeft: 55
  },
  centeredImage: {
    width: 280,
    height: 100,
    marginBottom: 200
  },
  rowContainer: {
    flexDirection: 'row', // Side-by-side layout
    justifyContent: 'space-between', // Add space between the containers
    paddingHorizontal: 20,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    zIndex: 2000

  },
  dropdownContainer: {
    borderColor: '#ccc',
    // borderWidth: 1,
    // borderRadius: 8,
    zIndex: 4000,
  },
  inputContainer: {
    flex: 1, // Take equal width
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonTexts: {
    fontSize: 18,
    color: '#007BFF',
    marginVertical: 10,
  },
  buttonTexts1: {
    fontSize: 18,
    color: 'white',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    marginVertical: 2,
    fontWeight: 'bold'
  },
  buttonText1: {
    fontSize: 20,
    // color: 'white',
    color: 'black',
    marginVertical: 5,
    marginLeft: -10
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '30%',
    color: 'black',
    // alignItems:'center'
  },
  inputcss: {
    width: '90%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: '5%'
  },
  ovalButton2: {
    backgroundColor: 'green',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  ovalButton3: {
    backgroundColor: 'blue',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150
  },
  dialogContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});


export default Login;
