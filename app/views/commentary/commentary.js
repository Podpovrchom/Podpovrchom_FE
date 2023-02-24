import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const Commentary = ({ navigation }) => {
  const API_KEY = 'f21e49f9d7cfb7b360cf672c2810e6d3'
  const [bibleData, setBibleData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [bookData, setBookData] = useState([])
  const [chaptersNumber, setChaptersNumber] = useState(null)
  const [currentData, setCurrentData] = useState({ book: 'Zjevení', chapter: 1 })
  const [chapterVisible, setChapterVisible] = useState(currentData.book)
  const [chapterContent, setChapterContent] = useState([])

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
    getBookData()
    getChapterContent()
  }, [])

  const getBookData = () => {
    const http = axios.create({
      baseURL: 'https://api.scripture.api.bible/v1',
      headers: { 'api-key': API_KEY }
    })
    http
      .get('/bibles/c0209b58481727a2-01/books/REV/chapters').then(response => {
        setBookData(response.data.data)
        setChaptersNumber(response.data.data.length)
      })
      .catch(function (error) {
        // handle error
        alert(error.message)
      })
  }

  const getChapterContent = () => {
    const http = axios.create({
      baseURL: 'https://api.scripture.api.bible/v1',
      headers: { 'api-key': API_KEY }
    })
    http
      .get('/bibles/c0209b58481727a2-01/chapters/Rev.21?content-type=json&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false').then(response => {
        const data = response.data.data.content
        let newData = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].attrs.style === 's1') {
            const array = {}
            array.text = data[i].items[0].text
            array.type = 'title'
            newData = [...newData, array]
          } else if (data[i].attrs.style === 'q1') {
            if (data[i].items.length > 1) {
              const array = {}
              array.verseId = data[i].items[1].attrs.verseId
              array.text = data[i].items[1].text
              newData = [...newData, array]
            } else {
              const array = {}
              array.verseId = data[i].items[0].attrs.verseId
              array.text = data[i].items[0].text
              newData = [...newData, array]
            }
          } else {
            const maslo = data[i].items.filter(item => item.attrs.verseId)
            for (let i = 0; i < maslo.length; i++) {
              const array = {}
              array.verseId = maslo[i].attrs.verseId
              array.text = maslo[i].text
              newData = [...newData, array]
            }
          }
        }

        const formatedData = []
        let versId = ''
        let fullText = ''
        let versNumber = 0
        for (const x of newData) {
          // console.log(x)
          if (x && Object.keys(x).includes('verseId')) {
            if (versId === x.verseId) {
              fullText += (' ' + x.text)
            } else {
              fullText.length > 0 && formatedData.push({ text: fullText, verseId: versId, id: versNumber })
              versId = x.verseId
              fullText = x.text
              versNumber = versNumber + 1
            }
          } else {
            formatedData.push(x)
          }
        }
        console.log(formatedData)
        setChapterContent(formatedData)
      })
      .catch(function (error) {
        // handle error
        alert(error.message)
      })
  }

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
                    onPress={() => {
                      setModalVisible(true)
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{currentData.book}</Text>
                </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#1B1F23',
        shadowColor: 'transparent', // ios
        elevation: 0 // android
      }
    })
  }, [])

  const handleClick = (name) => {
    setChapterVisible(name)
  }

  const Item = ({ bookName }) => (
        <View style={{ backgroundColor: '#2D343B', marginBottom: 7, borderRadius: 7 }}>
            <TouchableOpacity onPress={() => handleClick(bookName)} style={{ padding: 15 }}>
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
        <View style={styles.container}>
            {bookData.length > 0 && (
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
                                <Text
                                    style={{ fontSize: 18, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
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
            )}
            <StatusBar barStyle="light-content"/>
            <View style={{ paddingTop: 5, paddingHorizontal: 15, backgroundColor: '#1B1F23' }}>
                <ScrollView>
                    {chapterContent.length > 0 && chapterContent.map((item, index) => (
                        <>
                            {item.type === 'title'
                              ? (
                                    <View style={{ marginTop: 5, marginBottom: 10 }}>
                                        <Text style={{
                                          fontWeight: 'bold',
                                          fontSize: 17,
                                          color: '#F0F0F0'
                                        }}>{item.text}</Text>
                                    </View>
                                )
                              : (
                                    <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        <Text style={{ fontSize: 16, color: '#F0F0F0' }}>
                                            <View style={{ paddingRight: 5 }}><Text style={{
                                              fontSize: 12,
                                              color: '#00CFE6',
                                              fontWeight: 'bold'
                                            }}>{item.id}</Text></View>
                                            {item.text}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                        </>

                    ))}
                    {/*  {chapterContent.length > 0 && chapterContent.map((item) => (
                        <>
                            {item.attrs.style === 's1'
                              ? (
                                    <View style={{ marginVertical: 5 }}
                                          key={item.items.text}>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item.items[0].text}</Text>
                                    </View>
                                )
                              : (
                                    <>
                                        {item.items.map(el => console.log(el))}
                                    </>
                                )}

                            {item.attrs.style !== 's1' && (
                              item.items.map((el, index) => (
                                    <View key={index} style={{ borderColor: 'orange', borderWidth: 1 }}>
                                        <View>
                                            {el.attrs.number &&
                                                (
                                                    <Text
                                                        style={{
                                                          fontSize: 17,
                                                          fontWeight: 'bold'
                                                        }}>{el.items[0].text}</Text>
                                                )}
                                        </View>
                                        <View>
                                            {el.text &&
                                                (
                                                    <Text style={{ fontSize: 15 }}>{el.text}</Text>
                                                )}
                                        </View>
                                    </View>
                              ))
                            )

                            }
                        </>
                    ))} */}
                </ScrollView>
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
    // alignItems: 'center',
    // justifyContent: 'flex-start'
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
