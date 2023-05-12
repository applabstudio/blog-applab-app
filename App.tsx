import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ArticleDetail from './src/components/Article/ArticleDetail';
import ContactScreen from './src/Screens/ContactScreen';
import {Image, View} from 'react-native';
import BottomTabBar from './src/components/UI/BottomTabBar';
import ArticleScreen from './src/Screens/ArticleScreen';

const Stack = createStackNavigator();

export const LogoTitle = () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={require('./src/assets/images/logo.png')} />
    </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={BottomTabBar}
          options={{
            headerLeft: () => {
              return <LogoTitle />;
            },
            headerTitleAlign: 'center', // Aggiungi questa opzione
            headerShown: true, // Imposta a true per mostrare la barra superiore
          }}
        />
        <Stack.Screen
          name="ArticleDetail"
          component={ArticleDetail}
          options={{title: 'Pagina Articolo'}}
        />
        <Stack.Screen
          name="ContactScreen" // Dichiarazione della schermata ContactScreen
          component={ContactScreen}
          options={{title: 'Contattaci'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
