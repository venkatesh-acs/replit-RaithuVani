import { Alert, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import React, { Component, useEffect, useState, } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { LoginService } from '../service/LoginService'
import { FlatList } from 'react-native-gesture-handler'
// import { FlatList } from 'react-native' 

const Issues: React.FC = () => {
  const navigation = useNavigation();
  const uType = 'farmer';
  const [data, setData] = useState<any[]>([])
  const [userType, setUserType] = useState<any>(null)
  useEffect(() => {
    const userTypeNavigate = async () => {
      const usertype = await AsyncStorage.getItem("usertype");
      console.log("usertype", usertype);
      setUserType(usertype)
      // if (uType !== usertype) {
      //   navigation.navigate('ActonIssuesListShow' as never);
      // }
    }
    userTypeNavigate()
  }, [])
  useFocusEffect(
    React.useCallback(() => {
      issueList();
      removeId();
    }, [])
  );
  const issueList = async () => {
    const uid = await AsyncStorage.getItem('uid');
    // const uid = '5e4ae49d8a9a87.17240384'
    const apiname = 'ws_issues.php';
    const payload = { uid: uid };
    console.log("issuelist_payload", uid)
    const res = await LoginService.getData(apiname, payload)
    console.log("issuelist", res)
    if (res) {
      if (res.issuearray !== 'Nodata') {
        setData(res.issuearray)
      } else {
        Alert.alert(
          '',
          res.issuearray,
          [{ text: 'OK' }]
        );
      }
    }
  }
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
          <TouchableOpacity onPress={() => { navigation.navigate('solutionsList' as never,), AsyncStorage.setItem("selected_issue", JSON.stringify(item)) }}>
            <Text style={styles.arrow}>--&gt;</Text>
          </TouchableOpacity>
        </View>
      </View>

    )

  }
  const removeId = async () => {
    await AsyncStorage.removeItem('selected_solution_id')
  }
  return (
    <View style={styles.container}>
      {userType !== uType && (
        <TouchableOpacity onPress={() => navigation.navigate('searchList' as never)}>
          <Text style={{ alignSelf: 'center', color: 'black', borderColor: 'blue', fontSize: 20, width: '50%', textAlign: 'center', marginTop: 10, paddingVertical: 5, borderWidth: 2, borderRadius: 20, marginBottom: 5 }}>Search</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>Issues List</Text>
      <FlatList data={data} keyExtractor={(item) => item.issueid.toString() || ''}
        renderItem={renderItem}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',

    // padding:5
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

})

export default Issues