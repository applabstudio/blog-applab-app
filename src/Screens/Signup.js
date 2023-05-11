import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const Signup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Registered');
        navigation.navigate('Home');
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
        Sign up
      </Text>
      <TextInput
        placeholder="Nome"
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 1,
          alignSelf: 'center',
          marginTop: 20,
          paddingLeft: 20,
        }}
        onChangeText={name => setName(name)}
      />
      <TextInput
        placeholder="Email"
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 1,
          alignSelf: 'center',
          marginTop: 20,
          paddingLeft: 20,
        }}
        onChangeText={email => setEmail(email)}
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
        onChangeText={password => setPassword(password)}
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
        onPress={handleRegister}>
        <Text style={{color: 'white', fontSize: 18}}>Sign up</Text>
      </TouchableOpacity>
      <Text
        style={{
          textDecorationLine: 'underline',
          fontSize: 18,
          marginTop: 60,
          alignSelf: 'center',
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        {'Ho già un account'}
      </Text>
    </View>
  );
};

export default Signup;
