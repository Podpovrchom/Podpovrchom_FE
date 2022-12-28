import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Articles } from '../views/articles/articles'
import { Videos } from '../views/videos/videos'
import { Commentary } from '../views/commentary/commentary'
import { MoreOptions } from '../views/more/moreOptions'
import { Home } from '../views/home/home'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHouse, faBookBible, faBookOpen, faBars } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'
import { Platform, useWindowDimensions } from 'react-native'

const Tab = createBottomTabNavigator()

export const AppTabScreen = () => {
  const getRouteIcon = name => {
    switch (name) {
      case 'Videá':
        return faYoutube
      case 'Komentár':
        return faBookBible
      case 'Články':
        return faBookOpen
      case 'Viac':
        return faBars
      default:
        return faHouse
    }
  }
  const getLabelStyles = () => {
    if (Platform.OS === 'ios') {
      const windowHeight = useWindowDimensions().height
      return {
        labelStyle: {
          fontSize: 12,
          bottom: windowHeight <= 800 ? 7 : 5
        }
      }
    }
    return {
      labelStyle: {
        fontSize: 12,
        bottom: 10
      }
    }
  }

  return (
        <Tab.Navigator
            initialRouteName="Domov"
            barStyle={{ backgroundColor: '#2D343B' }}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                const iconName = getRouteIcon(route.name)
                return <FontAwesomeIcon icon={iconName} size={size} color={color}/>
              },
              tabBarStyle: {
                backgroundColor: '#2D343B',
                height: 90
              }
            })}
            options={{
              animationEnabled: false
            }}
            tabBarOptions={{
              activeTintColor: '#00CFE6',
              inactiveTintColor: '#A3A3A3',
              keyboardHidesTabBar: true,
              ...getLabelStyles()
            }}
        >
            <Tab.Screen name="Domov" component={Home}/>
            <Tab.Screen name="Videá" component={Videos}/>
            <Tab.Screen name="Komentár" component={Commentary}/>
            <Tab.Screen name="Články" component={Articles}/>
            <Tab.Screen name="Viac" component={MoreOptions}/>
        </Tab.Navigator>
  )
}
