import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { AppTabScreen } from './app/navigation/navigator'

export default function App () {
  return (
        <NavigationContainer>
            <StatusBar style="light"/>
            <AppTabScreen/>
        </NavigationContainer>
  )
}
