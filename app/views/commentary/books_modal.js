import React, { useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export const BooksModal = ({ bibleData, modalVisible, isVisibleModal, currentData, chaptersNumber }) => {
  const [chapterVisible, setChapterVisible] = useState(currentData.book)

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
                        renderItem={({ item }) => <Item bookName={item.name}/>}
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
