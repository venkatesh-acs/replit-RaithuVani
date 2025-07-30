import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginService } from '../service/LoginService'
import { useFocusEffect } from '@react-navigation/native'
import Video from 'react-native-video';

const SingleSolution = () => {
    const [uid, setUid] = useState<any>(null)
    const [usertype, setUserType] = useState<any>(null)
    const [data, setData] = useState<any>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [eventIds, setEventIds] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    console.log('selectedImage', selectedImage)
    const [types, setType] = useState<any>(null)
    // useEffect(() => {
      
    //     issueData()
    // }, []);
    const getUid = async () => {
        const uid = await AsyncStorage.getItem('uid')
        const usertype = await AsyncStorage.getItem('usertype')
        setUid(uid)
        setUserType(usertype)
    }
    useFocusEffect(
        React.useCallback(() => {
            getUid()
          issueData();
        }, [])
      );
    const issueData = async () => {
        const SelectedBarcodeDataValue = await AsyncStorage.getItem('selected_solution') as any;
        const parsedData = typeof SelectedBarcodeDataValue === 'string' ? JSON.parse(SelectedBarcodeDataValue) : SelectedBarcodeDataValue
        const { issueid } = parsedData;
        const apiname = 'ws_issueslist.php'
        const payload = { issueid: issueid }
        console.log("issue_data_single_soln_payload", payload)
        const res = await LoginService.getData(apiname, payload)
        console.log("issue_data_single_soln", res.eventarray)
        if (res) {
            setData(res.eventarray[0]);
            // const gradesArray = res.eventids.split(",");
            // setGrades(gradesArray);
            // const gradesArray = res.eventids.split(",");
            // const mappedGrades = gradesArray.map((grade: any, index: any) => `A ${index},`);
            // setGrades(mappedGrades);
            const eventIdsArray = res.eventids.split(',');
            setEventIds(eventIdsArray);
            const dynamicGrades = eventIdsArray.map((_: any, index: any) => `a${index + 1}`);
            setGrades(dynamicGrades);
        }
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
            {/* <Image source={{ uri: data.youtube }} style={{ width: '100%', height: 200, marginTop: 5 }}></Image> */}
            {data.type == 'photo' ?
                (
                    < Image source={{ uri: data.imageurl }} style={{ width: '100%', height: 200, marginTop: 5 }}></Image>
                ) : (
                    <Video
                        source={{ uri: data.youtube }}
                        style={{ width: '100%', height: 200, marginTop: 5 }}
                        controls
                        resizeMode="cover"
                    />
                )
            }
            <Text style={styles.date}>{data.vdate}</Text>
            <View style={styles.name_phone}>
                <Text style={styles.names}>{data.farmername}</Text>
                <Text style={styles.phones}>{data.phonenumber}</Text>
            </View>
            {usertype && (
                <View >
                    <Text style={styles.date}>{data.address}</Text>
                    <Text style={styles.date}>{data.description}</Text>
                    <View style={{ flexDirection: 'row' }} >
                        <Text style={styles.files}>Media Files:</Text>
                        {/* <Text style={styles.files}>{grades}</Text> */}
                        {grades.map((grade, index) => (
                                <TouchableOpacity
                                    key={index}
                                    // style={styles.gradeButton}
                                    onPress={() => handleGradeClick(grade)} // Trigger grade click
                                >
                                    <Text style={styles.files}>{grade}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>
            )}
            <View>
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
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
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

export default SingleSolution