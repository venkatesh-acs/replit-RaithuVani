import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { LoginService } from '../service/LoginService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';


const imagename = require('../assets/gfn/splash.jpg');
const caplogimg = require('../assets/gfn/raithu_logo.png');
const Reactivate: React.FC = () => {

    const [email, setEmail] = useState<any>(null);
    const [phone, setPhone] = useState<any>(null);
    const [name, setName] = useState<any>(null)
    const [openmandal, setOpenmandal] = useState(false);
    const [mandal, setMandal] = useState<any>(null);
    const [mandaldropData, setmandalDropData] = useState<any>([]);
    const [distdropData, setdistDropData] = useState<any>([]);
    const [opendist, setOpendist] = useState(false);
    const [district, setDistrict] = useState<any>(null);
    // Function to handle phone press
    const handlePhoneChange = (text: any) => {
        // Remove non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');

        // Only allow up to 10 digits
        if (numericText.length <= 10) {
            setPhone(numericText);
        }
    };
    const [dropData, setDropData] = useState<any>([]);

    useFocusEffect(
        React.useCallback(() => {
            getSatateDropdown()

        }, [])
    )
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
    useEffect(() => {
        if (district) {
            getMandalDropdown();
        }
    }, [district]);
    const getDistrictDropdown = async () => {
        const apiname = 'ws_reg_district.php';
        console.log('usertype-apiname', apiname)
        // const countryid = await AsyncStorage.getItem('uid')
        const payload = { stateid: 1 };
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

    const reactivation = async () => {
        const currentURL = await AsyncStorage.getItem('currentURL')
        const apiname = 'ws_an_forgotpass.php';
        const payload = { email: email, phone: phone, name: name, liveurl: currentURL, mandal: mandal };
        console.log('payload', payload)
        const res = await LoginService.getData(apiname, payload);
        console.log('res', res.message);
        if (res) {
            Alert.alert('Upload Status', res.message, [{ text: 'OK' }]);
        }
    }

    // Close other dropdowns when one is opened
    const handleDropdownOpen = (current: any) => {
        setOpendist(current === "district");
        setOpenmandal(current === "mandal");
    };
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>

                <View style={styles.imageContainer}>
                    <Image source={caplogimg} style={styles.centeredImage} />
                </View>
                <View>
                    <TextInput
                        onChangeText={(text) => setEmail(text)}
                        style={styles.textInput}
                        placeholder="Email"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value={email}
                    />
                    <TextInput
                        onChangeText={(text) => setName(text)}
                        style={styles.textInput}
                        placeholder="Name"
                        placeholderTextColor='black'
                        autoCapitalize='none'
                        value={name}
                    />
                    <TextInput
                        value={phone}
                        onChangeText={handlePhoneChange}
                        style={styles.textInput}
                        placeholder="Phone"
                        placeholderTextColor='black'
                        keyboardType='numeric'
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
                        // zIndex={1000}
                        onClose={() => setOpenmandal(false)}
                    />
                </View>
                <TouchableOpacity onPress={reactivation} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Cancel Deletion</Text>
                </TouchableOpacity>

            </ImageBackground>
        </View>
    )
}

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
    centeredImage: {
        width: 280,
        height: 100,
        marginBottom: 200
    },
    textInput: {
        borderColor: "black",
        borderBottomWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white',
        marginLeft: 10,
        width: '95%',
        color: 'black',
        // marginBottom:10
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
    buttonText: {
        fontSize: 20,
        color: 'white',
        marginVertical: 2,
        fontWeight: 'bold'
    },
    dropdownContainer: {
        borderColor: '#ccc',
        // borderWidth: 1,
        // borderRadius: 8,
        zIndex: 4000,
        width: '95%',
        marginLeft: '2.5%',
    },
    dropdown: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        marginBottom: 10,
        zIndex: 2000,
        width: '95%',
        marginLeft: '2.5%',
        marginTop: 10


    },

})

export default Reactivate