import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View ,TextInput,FlatList} from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginService } from '../service/LoginService';
import { Alert } from 'react-native';
// import { FlatList  } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

const SolutionList: React.FC = () => {
    const [uid, setUid] = useState<any>(null)
    const [usertype, setUserType] = useState<any>(null)
    const [listSolution, setListSolution] = useState<any>([])
    const [data, setData] = useState<any>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [eventIds, setEventIds] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    console.log('selectedImage', selectedImage)
    const [types, setType] = useState<any>(null)
    const uType = 'farmer';
    // useEffect(() => {
    //     getUid()
    //     issueData()
    //     getSolutionsImages()
    // }, []);
    useFocusEffect(
        React.useCallback(() => {
            setListSolution([])
            getUid();
            issueData();
            getSolutionsImages()
        }, [])
    );
    const getUid = async () => {
        const uid = await AsyncStorage.getItem('uid')
        const usertype = await AsyncStorage.getItem('usertype')
        setUid(uid)
        setUserType(usertype)
    }
    const issueData = async () => {
        const SelectedBarcodeDataValue = await AsyncStorage.getItem('selected_issue') as any;
        const parsedData = typeof SelectedBarcodeDataValue === 'string' ? JSON.parse(SelectedBarcodeDataValue) : SelectedBarcodeDataValue
        const { issueid } = parsedData;
        const apiname = 'ws_issueslist.php'
        const payload = { issueid: issueid }
        const res = await LoginService.getData(apiname, payload)
        console.log("issue_data_solutionlist", res)
        if (res) {
            setData(res.eventarray[0])
            // const gradesArray = res.eventids.split(",");
            // const gradesArray = res.eventids.split(",");
            const eventIdsArray = res.eventids.split(',');
            setEventIds(eventIdsArray);
            const dynamicGrades = eventIdsArray.map((_: any, index: any) => `a${index + 1}`);
            setGrades(dynamicGrades);
            // const mappedGrades = gradesArray.map((grade: any, index: any) => `A ${index},`);
            // setGrades(mappedGrades);
        }
    }
    const getSolutionsImages = async () => {
        const SelectedBarcodeDataValue = await AsyncStorage.getItem('selected_issue') as any;
        const parsedData = typeof SelectedBarcodeDataValue === 'string' ? JSON.parse(SelectedBarcodeDataValue) : SelectedBarcodeDataValue
        const { issueid } = parsedData
        const apiname = 'ws_solutionsimage.php'
        const payload = { issueid: issueid }
        // const payload = { issueid: 26 }
        const res = await LoginService.getData(apiname, payload)
        console.log("issue_data_solutions", res)
        if (res) {
            if (res.message === 'Nodata') {
                Alert.alert(
                    'Solutions List',
                    res.solutionsarray,
                    [{ text: 'OK' }]
                );
            } else {
                setListSolution(res.solutionsarray)
            }
        }
    }

    const navigation = useNavigation();
    // const renderItem = ({ item }: { item: any }) => {
    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return (
            <View style={styles.itemContainer}>
                {/* <View style={styles.blueLine}> */}
                <View style={styles.textContainer}>
                    <View style={styles.leftContainer}>
                        {/* <TextInput readOnly style={styles.idText}>{item.issueid}</TextInput> */}
                        <TextInput readOnly style={styles.idText}>{index + 1}</TextInput>
                        <TextInput readOnly style={styles.dateText}>{item.vdate}</TextInput>
                        <TextInput readOnly multiline={true} style={styles.descriptionText}>{item.description}</TextInput>
                    </View>
                    <View style={styles.blueLine} />
                    <TouchableOpacity onPress={() => { navigation.navigate('singlesolutionsList' as never,), AsyncStorage.setItem("selected_solution", JSON.stringify(item)) }}>
                        <Text style={styles.arrow}>--&gt;</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const handleGradeClick = async (grade: string) => {
        // Map the grade to the correct eventid based on position in the eventIds array
        const gradeIndex = grades.indexOf(grade); // Find the index of the clicked grade
        if (gradeIndex >= 0 && gradeIndex < eventIds.length) {
            const eventid = eventIds[gradeIndex]; // Get the corresponding eventid
            // fetchImageForEventId(eventid); // Fetch image for this eventid
            const apiname = 'ws_issueslist.php'
            const payload = { issueid: eventid }
            console.log('view_payload', payload)
            // const payload = { issueid: 26 }
            const res = await LoginService.getData(apiname, payload)
            console.log("view data", res)
            if (res) {
                if (res.eventarray[0].type === 'photo') {
                    setSelectedImage(res.eventarray[0].imageurl)
                } else {
                    setSelectedImage(res.eventarray[0].youtube)
                }
                setType(res.eventarray[0].type)
                setModalVisible(true);
            }
        }
    };
    return (
        <View style={styles.container}>
            {data.type == 'photo' ?
                (
                    < Image source={{ uri: data.imageurl }} style={{ width: '100%', height: 200, marginTop: 5 }}></Image>
                ) : (
                    <Video
                        source={{ uri: data.youtube }}
                        style={{ width: '100%', height: 200, marginTop: 5 }}
                        controls
                        resizeMode="cover"
                        repeat={true}
                    />
                )
            }
            <Text style={styles.date}>{data.vdate}</Text>
            <View style={styles.name_phone}>
                <Text style={styles.names}>{data.farmername}</Text>
                <Text style={styles.phones}>{data.phonenumber}</Text>
            </View>
            {
                usertype && (
                    <View >
                        <Text style={styles.date}>{data.address}</Text>
                        <Text style={styles.date}>{data.description}</Text>
                        <View style={{ flexDirection: 'row' }} >
                            <Text style={styles.files}>Media Files:</Text>
                            {grades.map((grade, index) => (
                                <TouchableOpacity
                                    key={index}
                                    // style={styles.gradeButton}
                                    onPress={() => handleGradeClick(grade)} // Trigger grade click
                                >
                                    <Text style={styles.files}>{grade}</Text>
                                </TouchableOpacity>
                            ))}
                            {/* <Text style={styles.files}>{grades}</Text> */}
                            {/* <Text style={styles.files}>{grades.join(', ')}</Text> */}
                        </View>
                        {usertype !== uType && (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'yellow', alignSelf: 'center', width: '50%', marginTop: 5, paddingVertical: 5, marginBottom: 5
                                }}
                                onPress={() => { navigation.navigate('singlesolutioncapture' as never,), AsyncStorage.setItem("selected_solution_id", JSON.stringify(data)) }}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, alignSelf: 'center' }}>Add Solution</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )
            }
            <View style={{flex:1}}>
                <Text style={styles.heading}>Solutions List</Text>
                <FlatList data={listSolution} keyExtractor={(item) => item.issueid.toString()}
                    renderItem={renderItem} contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
            {
                modalVisible && selectedImage && (
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            {types === 'photo' ? (
                                <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                            ) : (
                                <Video
                                    source={{ uri: selectedImage }}
                                    style={styles.modalImage}
                                    controls
                                    resizeMode="cover"
                                />
                            )}
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 5
    },
    date: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 5
    },
    name_phone: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    names: {
        marginRight: 20,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    phones: {
        marginRight: 20,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    files: {
        marginLeft: 5,
        color: 'black',
        fontWeight: 'bold'
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
    itemContainer: {
        // flexDirection:'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    blueLine: {
        width: 2,
        height: '100%',
        backgroundColor: 'blue',
        marginHorizontal: 10
    },
    textContainer: {
        // flex: 1,
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
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        borderRadius: 10,
    },
    modalImage: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    closeButton: {
        color: 'blue',
        fontSize: 18,
    },
})

export default SolutionList