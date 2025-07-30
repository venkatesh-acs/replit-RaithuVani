import { Alert, Dimensions, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginService } from '../service/LoginService'
import { Image } from 'react-native'
const caplogimg = require('../assets/gfn/raithu_logo.png');
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CancelDeactivate: React.FC = () => {
    const activates = async () => {
        const uid = await AsyncStorage.getItem('uid') as string;
        const email = await AsyncStorage.getItem('email') as string;

        const apiname = 'ws_canceldeactivate.php'
        const payload = { uid: uid, type: email };
        const res = await LoginService.getData(apiname, payload);
        console.log('res', res)
        if (res.message === "Your account is activated") {
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
            await AsyncStorage.setItem('deletionType','no');
        } else {
            Alert.alert(
                '',
                res.error_msg,
                [{ text: 'OK' }]
            );
        }
    }
    
    return (
        <View style={styles.container}>
                <Image source={caplogimg} style={{ width: 200, height: 70,  marginTop: 20,alignSelf:'center' }} />
                <Text style={{ color: 'black', marginTop: 30, marginLeft: 20, marginRight: 20, fontSize: 18 }}>You’ll need to reactivate your Page to cancel deletion. To cancel your Page deletion:
                Within 14 days of scheduling to delete your Page, from your main profile click your profile photo in the top right of Naturesnap.
            </Text>
            <TouchableOpacity style={styles.ovalButton4} onPress={activates}>
                <Text style={styles.buttonTexts}>Cancel Delete Account</Text>
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    ovalButton4: {
        backgroundColor: 'blue',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    buttonTexts: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        // justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: screenHeight * 0.05,
    },
    centeredImage: {
        width: screenWidth * 0.4,
        height: screenWidth * 0.4,
    },
    centimg: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.05,
        marginTop: 10,
    },
})

export default CancelDeactivate;