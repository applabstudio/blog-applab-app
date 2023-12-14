import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import BottomTabBar from '../components/UI/BottomTabBar';
import CategoryScreen from '../Screens/CategoryScreen';
import AccountScreen from '../Screens/AccountScreen';
import ArticleDetail from '../components/Article/ArticleDetail';
import ContactScreen from '../Screens/ContactScreen';
import Logo from '../components/UI/Logo';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Splash}
          name="Splash"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Login}
          name="Login"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Signup}
          name="Signup"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="main"
          component={BottomTabBar}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => {
              return <Logo />;
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
        <Stack.Screen
          name="Category" // Dichiarazione della schermata ContactScreen
          component={CategoryScreen}
          options={{title: 'Category'}}
        />
        <Stack.Screen
          name="Account" // Dichiarazione della schermata ContactScreen
          component={AccountScreen}
          options={{title: 'Account'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
