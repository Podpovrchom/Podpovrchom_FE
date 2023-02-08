import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const Commentary = ({ navigation }) => {
  const API_KEY = 'f21e49f9d7cfb7b360cf672c2810e6d3'
  const [bibleData, setBibleData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const http = axios.create({
      baseURL: 'https://api.scripture.api.bible/v1',
      headers: { 'api-key': API_KEY }
    })
    http
      .get('/bibles/c0209b58481727a2-01/books').then(response => {
        setBibleData(response.data)
        // console.log(response.data.data[0].id)
      })
      .catch(function (error) {
        // handle error
        alert(error.message)
      })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      backgroundColor: '#566370',
                      padding: 7,
                      borderRadius: 15,
                      marginBottom: 10
                    }}
                    onPress={() => setModalVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Zjavenie</Text>
                </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#2D343B',
        shadowColor: 'transparent', // ios
        elevation: 0 // android
      }
    })
  }, [])

  const Item = ({ bookName }) => (
        <TouchableOpacity style={{ backgroundColor: '#2D343B', marginBottom: 7, padding: 12, borderRadius: 7 }}><Text
            style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>{bookName}</Text></TouchableOpacity>
  )

  return (
        <View style={styles.container}>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible)
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ marginTop: 5, marginBottom: 15 }}>
                                <Text style={{ fontSize: 18, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                    Nový Zákon
                                </Text>
                            </View>
                            <FlatList
                                data={bibleData.data}
                                renderItem={({ item }) => <Item bookName={item.name}/>}
                                keyExtractor={item => item.name}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <FontAwesomeIcon icon={faXmark} size={18} color={'white'}/>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
            <StatusBar barStyle="light-content"/>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    width: '100%',
    height: '97%',
    bottom: -20,
    margin: 20,
    backgroundColor: '#1B1F23',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    position: 'absolute',
    top: 12,
    right: 15,
    borderRadius: 20,
    padding: 8,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2D343B'
  }
})
