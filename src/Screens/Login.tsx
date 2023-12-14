import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('main'); // Reindirizzamento alla home page se l'utente è già autenticato
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Logged in');
        navigation.replace('main'); // Reindirizzamento alla home page dopo il login
      })
      .catch(error => console.log(error));
  };
  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '800',
          alignSelf: 'center',
          marginTop: 100,
        }}>
        Login
      </Text>
      <TextInput
        placeholder="Inserisci la tua Email"
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 1,
          alignSelf: 'center',
          marginTop: 20,
          paddingLeft: 20,
        }}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 1,
          alignSelf: 'center',
          marginTop: 20,
          paddingLeft: 20,
        }}
        onChangeText={text => setPassword(text)}
      />

      <TouchableOpacity
        style={{
          marginTop: 20,
          width: '90%',
          height: 50,
          backgroundColor: 'purple',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}
        onPress={handleLogin}>
        <Text style={{color: 'white', fontSize: 18}}>Login</Text>
      </TouchableOpacity>
      <Text
        style={{
          textDecorationLine: 'underline',
          fontSize: 18,
          marginTop: 60,
          alignSelf: 'center',
        }}
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        {'Crea un nuovo account'}
      </Text>
    </View>
  );
};

export default Login;
