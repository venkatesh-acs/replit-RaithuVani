import { Button, Text, View } from 'react-native'
import React, { Component } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { NativeModules } from 'react-native'
import { useNavigation } from '@react-navigation/native'
const AboutUs: React.FC = () => {

    const pkg = require('../../package.json');

    const appVersion = pkg.version;
    const navigation = useNavigation();

    const handlePress = () => {
        if (navigation.canGoBack()) {
            navigation.navigate('Raithuvani' as never);
            // navigation.navigate('BottomTabs' as never);
        } else {
            navigation.goBack();
        }
    };
    return (

        <View>
            <Text style={{ fontSize: 20, marginLeft: '30%', marginTop: 20, color: 'black' }}>
                Raithuvani
            </Text>
            <Text style={{ fontSize: 20, marginLeft: '30%', marginTop: 10, color: 'black' }}>
                Version: {appVersion}
            </Text>
            <ScrollView style={{ margin: 10 }}>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    RaithuVani mobile app facilitate to Capture realtime
                    Videos and Photos of specific issue's, incident's or actions
                    being carried out as they are happening  instantly. Ofcourse,
                    the quality of issue is very much dependent on the quality of capture and description.
                    You will never struggle to tell reconstruct your issues again and again.
                    RaithuVani Mobile app is proven to reduce the issues of the farmers with
                    its captured proof of Videos and Photos.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>

                    Videos and Photos which are captured and uploaded by the users,
                    are secured strongly with industry standard technologies to avoid
                    any unauthorized access and modifications.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    These captured Videos or Photos along with date time and location
                    will be standing as a strong proof for use whenever and wherever it is required.
                </Text>
                <Text style={{ fontSize: 18, marginVertical: 5, lineHeight: 22, marginLeft: 10, color: 'black' }}>
                    The Videos and Photos can be viewed to the concerned
                    representatives as well as farmers whom are stayed across the same mandal for the appropriate use as proof either
                    through Mobile .
                </Text>


            </ScrollView>
        </View>
    )
}

export default AboutUs