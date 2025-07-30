import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../service/LoginService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Search: React.FC = () => {
    const [distdropData, setdistDropData] = useState<any>([]);
    const [opendist, setOpendist] = useState(false);
    const [district, setDistrict] = useState<any>(null);
    const [mandaldropData, setmandalDropData] = useState<any>([]);
    const [openmandal, setOpenmandal] = useState(false);
    const [mandal, setMandal] = useState<any>(null);
    const [need, setNeed] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [data, setData] = useState<any[]>([]);
    const navigation = useNavigation();
    // Close other dropdowns when one is opened
    const handleDropdownOpen = (current: any) => {
        setOpendist(current === "district");
        setOpenmandal(current === "mandal");
    };
    useFocusEffect(
        React.useCallback(() => {
            getDistrictDropdown()
        }, [])
    )
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
    const getDistrictDropdown = async () => {
        const apiname = 'ws_reg_district.php';
        console.log('usertype-apiname', apiname)
        // const countryid = await AsyncStorage.getItem('uid')
        const need = 1
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
    const searchData = async () => {
        if(district && mandal && description){
        const uid = await AsyncStorage.getItem('uid')
        const apiname = 'ws_search_issues.php';
        const payload = { did: district, mid: mandal, description: description, uid: uid };
        const res = await LoginService.getData(apiname, payload);
        console.log('search_res',res)
        if(res){
            if(res.issuearray !== 'Nodata'){
                setData(res.issuearray)
            }else{
                Alert.alert(
                    '',
                    res.issuearray,
                    [{ text: 'OK' }]
                );
            }
        }
        }else{
            Alert.alert(
                '',
                'Please Fill All The Details',
                [{ text: 'OK' }]
            );
        }

    }

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.itemContainer}>
                {/* <View style={styles.blueLine}> */}
                <View style={styles.textContainer}>
                    <View style={styles.leftContainer}>
                        <TextInput readOnly style={styles.idText}>{item.issueid}</TextInput>
                        <TextInput readOnly style={styles.dateText}>{item.vdate}</TextInput>
                        <TextInput readOnly multiline={true} style={styles.descriptionText}>{item.description}</TextInput>
                    </View>
                    <View style={styles.blueLine1} />
                    <TouchableOpacity onPress={() => { navigation.navigate('solutionsList' as never,), AsyncStorage.setItem("selected_issue", JSON.stringify(item)) }}>
                        <Text style={styles.arrow}>--&gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )

    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, color: 'blue', alignSelf: 'center', marginTop: 5, marginBottom: -5, fontWeight: 'bold' }}>Filter Issues Here</Text>
            <View style={styles.blueLine} />
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, color: 'blue', marginLeft: '5%', maxWidth: '35%' }}>Select District</Text>
                <Text style={{ fontSize: 20, color: 'blue', marginLeft: '20%', maxWidth: '35%' }} >Select Mandal</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.dropDownContainer}>
                    <DropDownPicker
                        open={opendist}
                        value={district}
                        items={distdropData}
                        setOpen={() => handleDropdownOpen("district")}
                        setValue={(value) => {
                            setDistrict(value);
                            setOpendist(false);
                            getMandalDropdown()
                        }}
                        setItems={setdistDropData}
                        placeholder="Select a District"
                        dropDownContainerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        zIndex={2000}
                        onClose={() => setOpendist(false)}
                    />
                </View>
                <View style={styles.dropDownContainer}>
                    <DropDownPicker
                        open={openmandal}
                        value={mandal}
                        items={mandaldropData}
                        setOpen={() => handleDropdownOpen("mandal")}
                        setValue={(value) => {
                            setMandal(value);
                            setOpenmandal(false);
                        }}
                        // setValue={setMandal}
                        setItems={setmandalDropData}
                        placeholder="Select a Mandal"
                        dropDownContainerStyle={styles.dropdownContainer}
                        style={styles.dropdown1}
                        zIndex={1000}
                        onClose={() => setOpenmandal(false)}
                    />
                </View>
            </View>
            <View>
                <TextInput value={description} autoCapitalize='none' onChangeText={(text) => setDescription(text)} style={styles.textInput1} placeholder="Enter Description" multiline={false} placeholderTextColor='black' />
            </View>
            <View style={styles.blueLine} />
            <TouchableOpacity onPress={() => searchData()}>
                <Text style={{ alignSelf: 'center', color: 'black', borderColor: 'blue', fontSize: 20, width: '50%', textAlign: 'center', marginTop: 10, paddingVertical: 5, borderWidth: 2, borderRadius: 20, marginBottom: 5 }}>Search</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>Issues List</Text>
            <FlatList data={data} keyExtractor={(item) => item.issueid.toString()}
                renderItem={renderItem}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dropdown: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        marginBottom: 10,
        maxWidth: '75%',
        marginLeft: '10%',
        zIndex:2000
    },
    dropdown1: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        marginBottom: 10,
        maxWidth: '75%',
        marginLeft: '10%',
        zIndex:2000
    },
    dropdownContainer: {
        borderColor: '#ccc',
        width: '75%',
        marginLeft: '10%'
    },
    blueLine: {
        width: '94%',
        height: 2,
        backgroundColor: 'blue',
        marginVertical: 10,
        marginLeft: '3%'
    },
    dropDownContainer: {
        // flexDirection:'row',
        // justifyContent:'space-between',
        // alignItems:'center'
        flex: 1,
        //  marginHorizontal: '2%'
    },
    textInput1: {
        backgroundColor: 'lightgrey',
        width: '94%',
        marginLeft: '3%'
    },
    itemContainer: {
        // flexDirection:'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    blueLine1: {
        width: 2,
        height: '100%',
        backgroundColor: 'blue',
        marginHorizontal: 10
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    idText: {
        fontWeight: 'bold'
    },
    dateText: {
        color: '#666'
    },
    descriptionText: {
        color: '#333',
        maxWidth: '50%'
    },
    arrow: {
        fontSize: 18,
        color: 'blue'
    },
    leftContainer: {
        flex: 1,
        paddingRight: 10, // Spacing before blue line
        flexDirection: 'row'
    },
    heading: {
        alignSelf: 'center',
        color: 'white',
        backgroundColor: '#6F8FAF',
        fontSize: 20,
        width: '98%',
        textAlign: 'center',
        marginTop: 5,
        paddingVertical: 5,
    },

})

export default Search