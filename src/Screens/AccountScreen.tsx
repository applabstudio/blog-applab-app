/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {createAvatar} from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';
import {SvgXml} from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation, CommonActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const AccountScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [avatarSvg, setAvatarSvg] = useState('');
  const navigation = useNavigation();
  const generateAvatar = () => {
    const svg = createAvatar(style, {
      seed: Date.now().toString(), // Genera un seed unico in base al timestamp
    });
    setAvatarSvg(svg);
  };

  const saveAvatarToFirestore = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('avatars').doc(user.uid).set({
          avatarSvg,
        });
        console.log('Avatar saved to Firestore');
      }
    } catch (error) {
      console.error('Error saving avatar to Firestore:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
      console.log('Logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    // Recupera l'email dell'utente corrente
    const currentUser = auth().currentUser;
    if (currentUser && currentUser.email) {
      setUserEmail(currentUser.email);
    }
    // Aggiorna l'avatar dell'utente
    generateAvatar();
  }, []);

  useEffect(() => {
    const fetchLastSavedAvatar = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const documentSnapshot = await firestore()
            .collection('avatars')
            .doc(user.uid)
            .get();

          if (documentSnapshot.exists) {
            const avatarData = documentSnapshot.data();
            const lastAvatar = avatarData?.avatarSvg || '';
            setAvatarSvg(lastAvatar);
          }
        }
      } catch (error) {
        console.error('Error fetching last saved avatar:', error);
      }
    };

    fetchLastSavedAvatar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          {avatarSvg ? (
            <LinearGradient
              colors={['#FF9800', '#F44336']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <SvgXml xml={avatarSvg} style={styles.avatar} />
            </LinearGradient>
          ) : null}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.username}>John Doe</Text>
          <Text style={styles.email}>{userEmail}</Text>
          <Button
            title="Change Avatar"
            onPress={generateAvatar}
            style={{marginBottom: 8}}
          />
          <Button
            title="Save Avatar"
            onPress={saveAvatarToFirestore}
            style={{marginBottom: 8}}
          />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#F0F2F5',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,

    justifyContent: 'space-between',
  },
  avatarContainer: {
    paddingLeft: 12,
    paddingTop: 12,
    display: 'flex',
    flexDirection: 'row',
  },
  avatarContainer2: {
    alignItems: 'flex-start',
    borderRadius: 50,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'orange',
  },
  avatar: {
    width: 120,
    height: 120,
  },
  avatarCircle: {
    borderRadius: 50, // metà della larghezza o altezza per ottenere un cerchio
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingRight: 12,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
    color: 'grey',
  },
});

export default AccountScreen;
