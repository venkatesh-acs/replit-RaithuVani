import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Button, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Divider } from 'react-native-paper';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginService } from '../service/LoginService';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';
// import { Video } from 'react-native-compressor';

const imagename = require('../assets/gfn/s3.jpg');
const camimg = require('../assets/gfn/camera.png');
const vidimg = require('../assets/gfn/video.png');
const upimg = require('../assets/gfn/gfnupload.png');
const capimg = require('../assets/gfn/circle.png');
const vidcapimg = require('../assets/gfn/recording.png');
const preimg = require('../assets/gfn/previous.png');

const { width, height } = Dimensions.get('window');
const isPortrait = height > width;

const textColor = isPortrait ? '#FFFFFF' : '#000000';
const Capture: React.FC = () => {
    const [need, setNeed] = useState<any>(null);
    const [description, setDescription] = useState<any>(null);
    const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo'); // Track camera mode
    const [showCamera, setShowCamera] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const camera = useRef<Camera>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<any>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const device = useCameraDevice('back');
    const [capturedMedia, setCapturedMedia] = useState<any>([]);
    const [uploadalert, setUploadAlert] = useState<any>(0);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropData, setDropData] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0); // Timer state
    const [uploadCount, setUploadCount] = useState(0);
    const [issueid, setIssueId] = useState<any>();
    console.log("capture_issue", issueid)
    const [address, setAddress] = useState<any>(null);
    const [userType, setUserType] = useState<any>(null);
    console.log('usertype', userType)
    const [isCompressing, setIsCompressing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const uType = 'farmer';
    useFocusEffect(
        React.useCallback(() => {
            getUid();
        }, [])
    );
    const getUid = async () => {
        const uid = await AsyncStorage.getItem('uid')
        const usertype = await AsyncStorage.getItem('usertype')
        // setUid(uid)
        setUserType(usertype)
    }
    useFocusEffect(
        React.useCallback(() => {
            if (userType && (userType !== uType)) {
                issueIdList();
            }
            addressData();
            if (userType && (userType === uType)) {
                removeId();
            }
        }, [userType])
    );
    useEffect(() => {

    }, [userType])
    const issueIdList = async () => {
        const ids = await AsyncStorage.getItem('selected_solution_id')
        const parsedData = typeof ids === 'string' ? JSON.parse(ids) : ids
        const { issueid } = parsedData
        setIssueId(issueid)
    }
    const addressData = async () => {
        const address = await AsyncStorage.getItem('address');
        setAddress(address)
    }
    const removeId = async () => {
        await AsyncStorage.removeItem('selected_solution_id')
    }
    const backtocapture = () => {
        setShowCamera(false);
    };
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);
    const capturePhoto = async () => {
        if (camera.current) {
            try {
                const photo = await camera.current.takePhoto({});
                const compressedPhoto = await ImageResizer.createResizedImage(
                    photo.path,
                    800,
                    600,
                    'PNG',
                    80
                );

                setCapturedPhoto(compressedPhoto.uri);
                setShowCamera(false);
                setMediaType('photo')
                console.log('Captured photo path:', compressedPhoto.uri);
                if (capturedMedia.length > 0) {
                    // Create a new array with the updated description for the last item
                    const updatedMedia = capturedMedia.map((media: any, index: any) => {
                        if (index === capturedMedia.length - 1) {
                            return { ...media, description: description }; // Update with current description
                        }
                        return media;
                    });

                    setCapturedMedia(updatedMedia);
                }

                // Set upload alert count to the current number of captured media
                setUploadAlert(capturedMedia.length);

                setDescription('');
                setDescription(null);

                // uploadPhoto(compressedPhoto.uri);
            } catch (error) {
                console.error('Error capturing photo:', error);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    const stopRecording = async () => {
        if (camera.current) {
            try {
                await camera.current.stopRecording();
                setShowCamera(false)
                setIsRecording(false);
                if (timer) clearInterval(timer); // Clear timer on stop
                setElapsedTime(0); // Reset timer display
            } catch (error) {
                console.error('Error stopping video recording:', error);
                setIsRecording(false);
                if (timer) clearInterval(timer); // Clear timer on error
            }
        }
    };
    const startRecording = async () => {
        if (camera.current) {
            try {
                setIsRecording(true);
                setElapsedTime(0);
                // Start the timer
                const intervalId = setInterval(() => {
                    setElapsedTime(prevTime => {
                        if (prevTime >= 30) {
                            clearInterval(intervalId);
                            stopRecording();
                            return 30;
                        }
                        return prevTime + 1;
                    });
                }, 1000);

                setTimer(intervalId);

                await camera.current.startRecording({
                    onRecordingFinished: video => {
                        console.log('Video recorded:', video);
                        setIsRecording(false);
                        setMediaType('video');
                        setCapturedPhoto(video.path);
                    },
                    onRecordingError: error => {
                        console.error('Recording error:', error);
                        setIsRecording(false);
                        if (timer) clearInterval(timer);
                    },
                });

            } catch (error) {
                console.error('Error starting video recording:', error);
                setIsRecording(false);
                if (timer) clearInterval(timer); // Clear timer on error
            }
        }
    };
    const handleUpload = async () => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia || '[]') || [];
            for (let media of existingMedia) {
                // await Promise.all(existingMedia.map(async (media: any) => {
                console.log('media', media)
                if (media.type === 'photo') {
                    console.log(media.description)
                    await uploadPhoto(media.uri, media.description);
                } else if (media.type === 'video') {
                    await uploadVideo(media.uri, media.description);
                }

                await removeMediaFromStorage(media); // Remove after upload
            }
            // }));

            setUploadCount(0); // Reset count after upload
            setCapturedMedia([]); // Clear captured media after upload
            // Alert.alert('Upload Status', 'All media uploaded successfully!', [{ text: 'OK' }]);
        } catch (error) {
            console.error('Error uploading media:', error);
            Alert.alert('Upload Status', 'Failed to upload media.', [{ text: 'OK' }]);
        }
    };
    const removeMediaFromStorage = async (media: any) => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia || '[]') || []; // Check for null

            // Filter out the media to be removed
            const updatedMedia = existingMedia.filter((item: any) => item.uri !== media.uri);

            // Save the updated media list back to AsyncStorage
            await AsyncStorage.setItem('capturedMedia', JSON.stringify(updatedMedia));
        } catch (error) {
            console.error('Error removing media from AsyncStorage:', error);
        }
    };
    const uploadPhoto = async (photoUri: any, description: string) => {
        const storedUid = await AsyncStorage.getItem('uid');
        const filename = photoUri.substring(photoUri.lastIndexOf('/') + 1);
        const formData = new FormData();
        formData.append('uploaded_file', {
            uri: photoUri,
            type: 'image/*',
            name: filename,
        });

        const today = new Date();
        // const formattedDate = today.toISOString().split('T')[0];
        const formattedDate = today.toISOString();
        formData.append('lastModDate', formattedDate);

        // formData.append('desc1', desc);
        formData.append('desc1', description);
        // formData.append('desc1', currentDescription);
        formData.append('uid1', storedUid);

        try {
            const apiname = 'UploadToServer.php';
            const response = await LoginService.uploadimage(apiname, formData);
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const countryname = await AsyncStorage.getItem('countryname') as any;
                const countrycode = await AsyncStorage.getItem('countrycode') as any;
                const statename = await AsyncStorage.getItem('statename') as any;
                const city = await AsyncStorage.getItem('city') as any;
                const zipcode = await AsyncStorage.getItem('zipcode') as any;
                const address = await AsyncStorage.getItem('address') as any;
                const districtname = await AsyncStorage.getItem('districtname') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                const shortstatecode = await AsyncStorage.getItem('shortstatecode') as any;
                const amberid = await AsyncStorage.getItem('amberid' as any)

                const apiname = 'ws_offlinedata.php';
                // const storedUid = '5e4ae49d8a9a87.17240384'
                const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, country: countryname, city: city, need: need, state: statename, postalCode: zipcode, description: description, filename: response, lastdatetime: formattedDate, issueid: issueid }
                const resmsg = await LoginService.getData(apiname, payload);
                setShowCamera(false);
                console.log('resmsg', resmsg);
                Alert.alert(
                    'Upload Status',
                    resmsg.error_msg,
                    [{ text: 'OK' }]
                );
                setNeed(null);
                setNeed('')
                setDescription(null);
                setDescription('')
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
        };
        setUploadAlert(0)
    };

    const addFileScheme = (uri: any) => {
        if (!uri.startsWith('file://')) {
            return `file://${uri}`;
        }
        return uri;
    };
    const uploadVideo = async (videoUri: any, description: string) => {
        console.log("videopath", videoUri)

        const storedUid = await AsyncStorage.getItem('uid');
        const formattedUri = addFileScheme(videoUri);
        const filename = videoUri.substring(videoUri.lastIndexOf('/') + 1);
        const formData = new FormData();
        formData.append('uploaded_file', {
            // uri: videoUri,
            uri: formattedUri,
            type: 'video/mp4',

            // type: 'video/*', 
            name: filename,
        });
        console.log("formData", formData)

        const today = new Date();
        console.log('today,', today);
        // const formattedDate = today.toISOString().split('T')[0];
        const formattedDate = today.toISOString();
        console.log('formattedDate,', formattedDate);

        formData.append('lastModDate', formattedDate);
        // formData.append('desc1', desc);
        formData.append('desc1', description);
        // formData.append('desc1', currentDescription);

        formData.append('uid1', storedUid);
        console.log('Entered videoupload formdata', formData)

        try {
            const apiname = 'UploadToServer.php';
            const response = await LoginService.uploadimage(apiname, formData);
            if (response !== undefined && response !== null && response !== '') {
                const storedUid = await AsyncStorage.getItem('uid') as string;
                const countryname = await AsyncStorage.getItem('countryname') as any;
                const countrycode = await AsyncStorage.getItem('countrycode') as any;
                const statename = await AsyncStorage.getItem('statename') as any;
                const city = await AsyncStorage.getItem('city') as any;
                const zipcode = await AsyncStorage.getItem('zipcode') as any;
                const address = await AsyncStorage.getItem('address') as any;
                const districtname = await AsyncStorage.getItem('districtname') as any;
                const latitude = await AsyncStorage.getItem('latitude') as any;
                const longitude = await AsyncStorage.getItem('longitude') as any;
                const shortstatecode = await AsyncStorage.getItem('shortstatecode') as any;
                const amberid = await AsyncStorage.getItem('amberid' as any)
                const apiname = 'ws_offlinedata.php';
                // const payload = { country:countryname,countrycode:countrycode,uid:storedUid,lat:latitude,lng:longitude,province:statename,city:city,postal_code:zipcode,formatted_address:address,filename:filename,lastdatetime:formattedDate,description:desc,groupid:selectedGroup,video_name:response}

                const payload = { lat: latitude, lng: longitude, uid: storedUid, formatted_address: address, country: countryname, city: city, need: need, state: statename, postalCode: zipcode, description: description, filename: response, lastdatetime: formattedDate, issueid: issueid }

                const resmsg = await LoginService.getData(apiname, payload);
                console.log('resmsg', resmsg);

                setShowCamera(false);
                Alert.alert(
                    'Upload Status',
                    resmsg.error_msg,
                    [{ text: 'OK' }]
                );
            }
            setNeed(null);
            setNeed('')
            setDescription(null);
            setDescription('')
            setIsCompressing(false);
        } catch (error) {
            console.error('Error uploading video:', error);
        };
        setUploadAlert(0)

    };
    const handleCapture = async () => {
        try {
            if (camera.current) {
                if (cameraMode === 'photo') {
                    const photo = await camera.current.takePhoto({});
                    const compressedPhoto = await ImageResizer.createResizedImage(
                        photo.path,
                        800,
                        600,
                        'PNG',
                        80
                    );
                    const mediaItem = {
                        uri: compressedPhoto.uri,
                        type: 'photo',
                        description: description || '',
                        timestamp: Date.now(),
                    };

                    setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                    await saveMedia(mediaItem);
                    setUploadCount((prevCount) => prevCount + 1); // Increment count
                    setShowCamera(false);
                    setDescription(null)
                    setDescription('')
                    setNeed(null)
                    setNeed('')

                } else if (cameraMode === 'video') {
                    if (!isRecording) {
                        await camera.current.startRecording({
                            onRecordingFinished: async (video) => {
                                const mediaItem = {
                                    uri: video.path,
                                    type: 'video',
                                    description: description || '',
                                    timestamp: Date.now(),
                                };
                                console.log("videopath", video.path);
                                setCapturedMedia((prevMedia: any) => [...prevMedia, mediaItem]);
                                await saveMedia(mediaItem);
                                setUploadCount((prevCount) => prevCount + 1); // Increment count
                                setDescription(null)
                                setDescription('')
                                setIsRecording(false);
                                setShowCamera(false);
                                setNeed(null)
                                setNeed('')
                            },
                            onRecordingError: (error) => {
                                console.error('Recording error:', error);
                                setIsRecording(false);
                            },
                        });
                        setIsRecording(true);

                        // Stop recording automatically after 30 seconds
                        setTimeout(async () => {
                            if (camera.current) { // Null check before stopping
                                await camera.current.stopRecording();
                                setIsRecording(false);
                                setDescription(null)
                            }
                        }, 30000);
                    } else {
                        await camera.current.stopRecording();
                        setIsRecording(false);
                    }
                }
            }
        } catch (error) {
            console.error('Error capturing media:', error);
        }
    };
    // Function to save media to AsyncStorage
    const saveMedia = async (media: any) => {
        try {
            const storedMedia = await AsyncStorage.getItem('capturedMedia');
            const existingMedia = JSON.parse(storedMedia as string) || []; // Type assertion here
            existingMedia.push(media);
            await AsyncStorage.setItem('capturedMedia', JSON.stringify(existingMedia));
        } catch (error) {
            console.error('Error saving media to AsyncStorage:', error);
        }
    };
    return (
        <View style={styles.container}>
            <ImageBackground source={imagename} style={styles.image}>
                {isCompressing && (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        style={{ position: 'absolute', top: '50%', left: '50%' }}
                    />
                )}
                {isUploading && (
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"
                        style={{ position: 'absolute', top: '50%', left: '50%' }}
                    />
                )}
                <View style={{ flexDirection: 'row', marginLeft: '15%' }}></View>
                {/* <Text style={{ marginTop: 30, fontSize: 25, marginLeft: 10, color: '#001f3f' }}>Description:</Text> */}
                <Text style={{ marginTop: 30, fontSize: 25, marginLeft: 10, color: 'white' }}>Description:</Text>

                <TextInput
                    onChangeText={(text) => setDescription(text)}
                    style={styles.textInput}
                    value={description}
                    placeholder="Enter Description"
                    placeholderTextColor='black'
                />
                <Text style={{ fontSize: 20, color: 'white', marginTop: 15, alignSelf: 'center', marginLeft: 10 }}>{address}</Text>
                <View style={{ flexDirection: 'row', marginTop: 60, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => { setShowCamera(true); setCameraMode('photo'); }}>
                        <Image source={camimg} style={styles.buttonImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setShowCamera(true); setCameraMode('video'); }}>
                        <Image source={vidimg} style={styles.buttonImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpload}>
                        <View style={styles.imageContainer}>
                            <Image source={upimg} style={styles.buttonImage} />
                            {uploadCount > 0 && (
                                <View style={styles.overlay}>
                                    <Text style={styles.uploadCount}>{uploadCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>

                </View>
                {device ? (
                    <>
                        {showCamera && (
                            <>
                                <View style={StyleSheet.absoluteFill}>
                                    <Camera
                                        ref={camera}
                                        style={StyleSheet.absoluteFill}
                                        device={device}
                                        isActive={true}
                                        photo={cameraMode === 'photo'}
                                        video={cameraMode === 'video'}
                                    />
                                    {/* <View style={styles.buttonContainer}>
                                        {cameraMode === 'photo' && !isRecording ? (
                                            <>
                                                <TouchableOpacity onPress={() => { capturePhoto(); }} style={{ marginTop: '40%' }}>
                                                    <Image source={capimg} style={styles.buttonImage} />
                                                </TouchableOpacity>
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <TouchableOpacity onPress={() => { backtocapture(); }} style={{ marginTop: '5%' }}>
                                                    <Image source={preimg} style={styles.buttonImage} />
                                                </TouchableOpacity>
                                            </>
                                        ) : cameraMode === 'video' && !isRecording ? (
                                            <>
                                                <TouchableOpacity onPress={() => { startRecording(); }}>
                                                    <Image source={vidcapimg} style={styles.buttonImage} />
                                                </TouchableOpacity><TouchableOpacity onPress={() => { backtocapture(); }}>
                                                    <Image source={preimg} style={styles.buttonImage} />
                                                </TouchableOpacity>
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                                <Divider />
                                            </>
                                        ) : (
                                            <View style={styles.recordingContainer}>
                                                <Button title="Stop Video" onPress={stopRecording} />
                                                <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
                                            </View>
                                        )}
                                    </View> */}
                                    <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
                                        <Camera
                                            ref={camera}
                                            style={{ width: '100%', height: '100%' }}
                                            device={device}
                                            isActive={true}
                                            photo={cameraMode === 'photo'}
                                            video={cameraMode === 'video'}
                                        />
                                        <View style={styles.timerContainer}>
                                            {isRecording && (
                                                <Text style={styles.timerText}>
                                                    {`${Math.floor(recordingTime / 60)}:${('0' + (recordingTime % 60)).slice(-2)}`}
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity onPress={handleCapture} >
                                                {/* <Image
                                                    source={cameraMode === 'photo' ? vidcapimg : isRecording
                                                        ? 'Stop Video'
                                                        : 'Start Video'
                                                    }
                                                    style={styles.buttonImages}
                                                />
                                                <Button
                                                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                                                    onPress={() => setIsRecording(!isRecording)}
                                                /> */}
                                                <TouchableOpacity
                                                    style={[styles.captureButton, { backgroundColor: isRecording ? '#FF0000' : '#28A745' }]}
                                                    onPress={handleCapture}
                                                >
                                                    <Text style={styles.buttonText}>
                                                        {cameraMode === 'photo' ? 'Capture Photo' : isRecording ? 'Stop Video' : 'Start Video'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={backtocapture} style={{ padding: 10 }}>
                                                <Image source={preimg} style={{ marginRight: 10, width: 60, height: 60, alignItems: 'center' }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}
                    </>
                ) : (
                    <Text style={styles.noCameraText}>No camera device available</Text> // Display this message when no camera is found
                )}
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 2,
        justifyContent: 'center'
    },
    uploadCount: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold'
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        // justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        top: +20, // Adjust top position
        left: +40, // Adjust left position
        // backgroundColor: 'rgba(0, 0,0, 0.3)',
        padding: 4,
        borderRadius: 5,
    },
    imageContainer: {
        position: 'relative',
    },
    timerText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 10,
    },
    textInput: {
        borderColor: "grey",
        borderBottomWidth: 1,
        borderStyle: "solid",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#B0E0E6',
        marginLeft: 20,
        marginRight: 5,
        width: '90%',
        color: 'black',
        borderRadius: 20
    },
    buttonImage: {
        width: 60,
        height: 60,
        marginLeft: 20
    },
    buttonImages: {
        width: 60,
        height: 60,
        // marginLeft: 10,
        alignItems: 'center'
    },
    buttonContainer: {
        position: 'absolute',
        top: '65%',
        left: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingContainer: {
        alignItems: 'center',
    },

    noCameraText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'red',
        margin: 20,
    },
    dropdown: {
        width: '95%',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
    },
    timerContainer: {
        position: 'absolute',
        top: 50, // Adjust position as needed
        left: '50%',
        transform: [{ translateX: -50 }],
        zIndex: 101,
    },
    captureButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
})

export default Capture