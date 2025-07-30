import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import AppSettings from '../service/Constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { LoginService } from '../service/LoginService';
import { Text } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

const imagename = require('../assets/gfn/splash.jpg');
const caplogimg = require('../assets/gfn/raithu_logo.png');

const Profile = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [currentURL, setCurrentURL] = useState('');
    const [uid, setUid] = useState<string | null>('');
    const [email, setEmail] = useState<string | null>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [dashdata, setDashData] = useState<[]>([]);
    console.log("Dashdata", dashdata)
    const [name, setName] = useState<any>(null)
    const [phonenumber, setPhone] = useState<any>(null);
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
    const [isPhoneValidDigits, setIsPhoneValid] = useState(true)
    const fetchURL = async () => {

        try {
            const uid = await AsyncStorage.getItem('uid');
            const email = await AsyncStorage.getItem('email');
            const url = await AppSettings.BASE_URL();
            const apiname = 'ws_getprofile.php'
            const payload = { uid: uid, email: email, liveurl: url };
            console.log('profile_payload', payload)
            const response = await LoginService.getData(apiname, payload);
            console.log('profile_response', response)
            if (response) {
                setDashData(response);
                setName(response.name || '');
                setPhone(response.phonenumber || '');
                setNeed(response.stateid || '');
                setMandal(response.mandalid || '');
                setDistrict(response.districtid || '');

            } else {
                Alert.alert('Error', 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching current URL:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        const uid = await AsyncStorage.getItem('uid');
        const email = await AsyncStorage.getItem('email');
        setUid(uid);
        setEmail(email);
    };
    useFocusEffect(
        React.useCallback(()=>{
            fetchURL();
            fetchData();
        },[])
    )

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Fetch the latest data again
        const uid = await AsyncStorage.getItem('uid');
        const email = await AsyncStorage.getItem('email');
        setUid(uid);
        setEmail(email);
        setRefreshing(false);
    };


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
    // Close other dropdowns when one is opened
    const handleDropdownOpen = (current: any) => {
        setOpenSub(current === "sub");
        setOpen(current === "state");
        setOpendist(current === "district");
        setOpenmandal(current === "mandal");
    };
    useEffect(() => {
        getSatateDropdown();
    }, []);
    const updateProfile = async () => {
        if(phonenumber.length ===10){
        const uid = await AsyncStorage.getItem('uid')
        const apiname = 'ws_updateprofile.php'
        const payload = { name: name, phone: phonenumber, uid: uid, state: need, district: district, mandal: mandal }
        const profile_res = await LoginService.getData(apiname, payload);
        console.log("Profile_response", profile_res)
        if (profile_res) {
            Alert.alert(
                '',
                profile_res.message,
                [{ text: 'OK' }]
            );
        }
        fetchURL();
    }else{
        Alert.alert(
            '',
            'Phone Numbers must be 10 digits',
            [{ text: 'OK' }]
        );
    }
    }
    const handlePhone = async (text:any) => {
        if (/^\d*$/.test(text)) {
            setPhone(text);
            setIsPhoneValid(text.length === 10)
        }

    }
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                </View>
                <View>
                    <TextInput
                        onChangeText={(text) => setName(text)}
                        style={styles.textInput}
                        placeholder="Fullname"
                        placeholderTextColor="black"
                        autoCapitalize='none'
                        value={name}
                    />
                    <TextInput onChangeText={(text) => handlePhone(text)} style={[styles.textInput, !isPhoneValidDigits && styles.errorInput]} placeholder="Enter Phone" keyboardType="numeric" maxLength={10}
                        onChange={(e) => {
                            const { text } = e.nativeEvent;
                            if (/^\d*$/.test(text)) {
                                setPhone(text);
                            }
                        }}
                        value={phonenumber}
                        placeholderTextColor='black'
                    />
                    {!isPhoneValidDigits && (
                        <Text style={styles.errorText}>Phone number must be 10 digits.</Text>
                    )}
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
                        setItems={setDropData}
                        dropDownContainerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        placeholder="Select a State"
                        zIndex={3000}
                        onClose={() => setOpen(false)}
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
                    <TouchableOpacity onPress={updateProfile} style={{ borderColor: 'blue', padding: 10, borderWidth: 2, backgroundColor: '#6F8FAF', width: '80%', marginLeft: '10%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>UPDATE</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width: width,
        // height: height,
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
    centeredImage: {
        width: '80%',
        height: '35%',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '80%',
        marginLeft: '10%',
        color: 'black'
    },
    dropdown: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        marginBottom: 10,
        width: '80%',
        marginLeft: '10%'

    },
    dropdownContainer: {
        borderColor: '#ccc',
        width: '80%',
        marginLeft: '10%'
    },
    errorInput:{
        borderColor:'red'
    },
    errorText:{
        color:'red',
        marginTop:5
    }
});

export default Profile