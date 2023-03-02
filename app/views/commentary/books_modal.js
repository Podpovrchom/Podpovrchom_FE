import React, { useEffect, useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Env from '../../shared/constants/env'

export const BooksModal = ({ bibleData, modalVisible, isVisibleModal, currentData }) => {
  const [chapterVisible, setChapterVisible] = useState(currentData.book)
  const [chaptersNumber, setChaptersNumber] = useState(null)

  const handleClick = (name, id) => {
    setChapterVisible(name)
    getNumbersOfChapter(id)
  }

  const getNumbersOfChapter = (id) => {
    const http = axios.create({
      baseURL: 'https://api.scripture.api.bible/v1',
      headers: { 'api-key': Env.API_KEY_BIBLE }
    })
    http
      .get(`/bibles/c0209b58481727a2-01/books/${id}/chapters`).then(response => {
        setChaptersNumber(response.data.data.length)
      })
      .catch(function (error) {
        // handle error
        alert(error.message)
      })
  }

  const Item = ({ bookName, id }) => (
        <View style={{ backgroundColor: '#2D343B', marginBottom: 7, borderRadius: 7 }}>
            <TouchableOpacity onPress={() => handleClick(bookName, id)} style={{ padding: 15 }}>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                    {bookName}
                </Text>
            </TouchableOpacity>
            {chapterVisible === bookName && (
                <View style={{
                  paddingTop: 15,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '100%'
                }}>
                    {Array(chaptersNumber)
                      .fill(0)
                      .map((x, idx) => (
                            <TouchableOpacity key={idx} style={{
                              backgroundColor: currentData.book === bookName && currentData.chapter === (idx + 1) ? '#566370' : '#2D343B',
                              justifyContent: 'center',
                              alignSelf: 'flex-start',
                              width: 40,
                              height: 40,
                              borderRadius: 20,
                              marginRight: 15,
                              marginBottom: 15
                            }}>
                                <Text style={{ fontSize: 15, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                                    {idx + 1}
                                </Text>
                            </TouchableOpacity>
                      ))}
                </View>
            )}
        </View>
  )

  return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              isVisibleModal(false)
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ marginTop: 5, marginBottom: 15 }}>
                        <Text
                            style={{ fontSize: 18, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                            Nový Zákon
                        </Text>
                    </View>
                    <FlatList
                        data={bibleData.data}
                        renderItem={({ item }) => <Item bookName={item.name} id={item.id}/>}
                        keyExtractor={item => item.name}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => isVisibleModal(false)}>
                        <FontAwesomeIcon icon={faXmark} size={18} color={'white'}/>
                    </Pressable>
                </View>
            </View>
        </Modal>
  )
}

const styles = StyleSheet.create({
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
