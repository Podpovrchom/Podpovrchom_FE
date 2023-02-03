import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import axios from 'axios'

export const Commentary = () => {
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

  const EachBook = ({ bookName }) => (<Text>{bookName}</Text>)

  const BibleBooks = () => (
        <View>
            {bibleData.data && bibleData.data.map(date => (<EachBook bookName={date.name} key={date.name}/>))}
        </View>
  )

  return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
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
