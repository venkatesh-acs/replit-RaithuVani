import { Alert, TouchableOpacity, Text, View } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ScrollView, } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../service/LoginService';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
const caplogimg = require('../assets/gfn/raithu_logo.png');
interface DeactivateProps {
    onLogout: () => void;
}

const Deactivate: React.FC<DeactivateProps> = ({ onLogout }) => {
    // const { onLogout } = route.params;
    const [isDeactivateChecked, setDeactivaeCheck] = useState(false);
    const [isPermanentChecked, setPermanentCheck] = useState(false);
    const [type, setType] = useState<string>('')
    // Function to handle checkbox press
    const handleCheckboxPress = (checked: any) => {
        setDeactivaeCheck(checked);
        if (checked) {
            setType('Deactive Account')
            setPermanentCheck(false)
        }
    };
    //handle permanent check
    const handlePermanentCheckboxPress = (checked: any) => {
        setPermanentCheck(checked);
        if (checked) {
            setType('Permanently Delete Account')
            setDeactivaeCheck(false)
        }
    };

    //to deactivate / delete account
    const delaccount = async () => {
        const storedUid = await AsyncStorage.getItem('uid') as any;
        const apiname = 'ws_deactivate.php';
        const payload = { uid: storedUid, type: type };
        console.log('payload', payload)
        if (storedUid && type) {
            const res = await LoginService.getData(apiname, payload);
            Alert.alert(
                '',
                res.message,
                [{ text: 'OK' }]
            );
            setType('');
            setDeactivaeCheck(false)
            setPermanentCheck(false)

            if (res.message === 'Your account is Permanently deleted' || res.message === 'Your account is deactivated') {
                await AsyncStorage.clear();
                onLogout()
                navigation.navigate('login' as never);
            }
        } else {
            Alert.alert(
                '',
                'Please enter all the details',
                [{ text: 'OK' }]
            );
        }
    };
    const navigation = useNavigation();
    const buttonText = isPermanentChecked ? 'Permanently Delete' : 'Deactivate';
    return (
        <ScrollView>
            <View style={{ marginTop: 20, }}>
                <>
                    <Image source={caplogimg} style={{ width: 280, height: 100, marginLeft: '10%', marginTop: 20 }} />
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: '10%' }}>
                        <BouncyCheckbox isChecked={isDeactivateChecked} onPress={handleCheckboxPress} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: 'black' }}>Deactive Account</Text>
                    </View>
                    <Text style={{ color: 'black', alignSelf: 'center', margin: 20 }}>
                        Deactivating your account can be temporary.
                        Your profile will be disabled and Your name and photos will be removed from most things you've shared. You'll be able to continue using your account.
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: '10%' }}>
                        <BouncyCheckbox isChecked={isPermanentChecked} onPress={handlePermanentCheckboxPress} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10, marginLeft: 10, color: 'black' }}>Permanently Delete Account</Text>
                    </View>
                    <Text style={{ color: 'black', alignSelf: 'center', margin: 20 }}>
                        When you delete your NriServices account, you won't be able to retrieve the content or information you've shared on NriServices. Your Special accounts and all of the Posts,services will also be deleted.
                    </Text>
                    <TouchableOpacity onPress={delaccount} style={{ backgroundColor: 'red', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'center', marginTop: 30 }} >
                        <Text style={{ color: 'white', fontSize: 20 }}>{buttonText}</Text>
                    </TouchableOpacity>
                </>
            </View>
        </ScrollView>
    )
}

export default Deactivate