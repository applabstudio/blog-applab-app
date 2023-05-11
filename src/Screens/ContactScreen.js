import React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';
import CustomButton from '../components/UI/CustomButton';

const ContactScreen = ({navigation}) => {
  const handleEmailPress = () => {
    const email = 'esempio@example.com';
    const subject = 'Richiesta di contatto';
    const body = 'Ciao,\n\nVorrei contattarvi riguardo...';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoLink);
  };

  const handleCallPress = () => {
    const phoneNumber = '0123456789';

    const telLink = `tel:${phoneNumber}`;

    Linking.openURL(telLink);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contatti</Text>
      <Text style={styles.description}>
        Puoi contattarci utilizzando uno dei seguenti metodi:
      </Text>
      <CustomButton
        title="Invia un'email"
        onPress={handleEmailPress}
        navigation={navigation} // Passa l'oggetto navigation come prop
      />
      <CustomButton
        title="Chiama"
        onPress={handleCallPress}
        navigation={navigation} // Passa l'oggetto navigation come prop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ContactScreen;
