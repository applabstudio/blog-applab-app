import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabBar from './src/components/UI/BottomTabBar';
import ArticleDetail from './src/components/Article/ArticleDetail';
import ContactScreen from './src/Screens/ContactScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={BottomTabBar}
          options={{headerShown: false}}
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
