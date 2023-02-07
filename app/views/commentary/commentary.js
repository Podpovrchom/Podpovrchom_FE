import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

  const EachBook = ({ bookName }) => (
        <TouchableOpacity style={{ backgroundColor: '#1B1F23', marginBottom: 5, padding: 2 }}><Text
            style={{ color: 'white' }}>{bookName}</Text></TouchableOpacity>)

  const BibleBooks = () => (
        <View>
            {bibleData.data && bibleData.data.map(date => (<EachBook bookName={date.name} key={date.name}/>))}
        </View>
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
                            <BibleBooks/>
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
    margin: 20,
    bottom: -20,
    width: '100%',
    backgroundColor: '#2D343B',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#1B1F23'
  }
})
