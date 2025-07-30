import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const imagename = require('../assets/ah.jpg');
// const caplogimg = require('../assets/ic_kw.png');
// const loimg = require('../assets/gfn/textlogo.png');
const imagename = require('../assets/gfn/login.jpg');
const caplogimg = require('../assets/gfn/ic_launcher.png');
const loimg = require('../assets/gfn/gfnlogo.png');

const EnvironmentSelect: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>('prod');
    const [items, setItems] = useState([
        { label: 'Dev', value: 'deve' },
        { label: 'Val', value: 'val' },
        { label: 'Prod', value: 'prod' }
    ]);
    useEffect(() => {
        const getStoredEnv = async () => {
            try {
                const storedEnv = await AsyncStorage.getItem('selectenv');
                if (storedEnv) {
                    setValue(storedEnv);  // Set the dropdown value to the stored value
                }
            } catch (error) {
                // console.error('Failed to load the selected environment:', error);
            }
        };
        getStoredEnv();  // Call the async function to retrieve the stored value
    }, []);
    const storedEnv = AsyncStorage.getItem('selectenv') as any;
    const navigation = useNavigation<any>();
    //To redirect to login
    const logins = async () => {
        await AsyncStorage.setItem('selectenv', value);
        navigation.navigate('login');
    }
    return (
        <View style={styles.container}>

            <ImageBackground source={imagename} style={styles.image}>
                <Image source={caplogimg} style={{ width: 150, height: 150, marginLeft: '30%', marginTop: 20 }} />
                {/* <Image source={loimg} style={{ width: 250, height: 40, marginLeft: '20%', marginTop: 30 }} /> */}

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{ backgroundColor: 'white', marginTop: 20, width: '90%', alignSelf: 'center' }}
                    placeholder='Select an Environment'
                    dropDownContainerStyle={{ alignSelf: 'center', backgroundColor: 'white', width: '90%', marginTop: 20 }}
                />

                {/* <TouchableOpacity style={styles.button} onPress={logins}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity> */}
                 {storedEnv === '' && (
                    <TouchableOpacity style={styles.button} onPress={logins}>
                        <Text style={styles.buttonText}>BACK</Text>
                    </TouchableOpacity>
                )}
                {storedEnv !== '' && (
                    <TouchableOpacity style={styles.buttons} onPress={logins}>
                        <Text style={styles.buttonText}>BACK</Text>
                    </TouchableOpacity>
                )}
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
    textInput: {
        borderColor: "black",
        borderBottomWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'white',
        marginLeft: 10,
        width: '95%'
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 10,
    },
    label: {
        marginLeft: 10,
    },
    button: {
        marginTop: 30,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "grey",
        marginLeft: 10,
        width: '95%',
        borderRadius: 20
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
    },
    buttons: {
        marginTop: 30,
        borderColor: "lightgray",
        borderWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "blue",
        marginLeft: '20%',
        width: '60%',
        borderRadius: 20
    },
    
});

export default EnvironmentSelect