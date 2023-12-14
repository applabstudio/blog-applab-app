import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const Splash = ({navigation}) => {
  // Aggiungi la chiamata a checkUserLoggedOut all'interno di useEffect
  useEffect(() => {
    const checkUserLoggedOut = async () => {
      // Verifica lo stato di autenticazione dell'utente
      const user = auth().currentUser;
      if (!user) {
        // Utente già sloggato, reindirizza a Login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }
    };

    checkUserLoggedOut();
  }, [navigation]);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      // Aggiungi qui la logica per verificare se l'utente è già loggato su Firebase

      // Esempio di logica di verifica dell'utente loggato
      const userIsLoggedIn = true; // Sostituisci con la tua logica di verifica

      if (userIsLoggedIn) {
        navigation.navigate('main');
      } else {
        navigation.navigate('Login');
      }
    };

    setTimeout(() => {
      checkUserLoggedIn();
    }, 3000);
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('../assets/images/logo.png')} />
      <Text style={{fontSize: 16, fontWeight: '600', marginTop: 8}}>
        News App
      </Text>
    </View>
  );
};

export default Splash;
