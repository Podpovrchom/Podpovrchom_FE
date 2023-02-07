import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios'

export const Commentary = ({ navigation }) => {
  const API_KEY = 'f21e49f9d7cfb7b360cf672c2810e6d3'
  const [bibleData, setBibleData] = useState([])

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
                    }}>
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

  const EachBook = ({ bookName }) => (<Text>{bookName}</Text>)

  const BibleBooks = () => (
        <View>
            {bibleData.data && bibleData.data.map(date => (<EachBook bookName={date.name} key={date.name}/>))}
        </View>
  )

  return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            <BibleBooks/>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
