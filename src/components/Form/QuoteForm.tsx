import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  Button,
  ProgressBar,
  useTheme,
  TextInput as PaperTextInput,
  Title,
  Card,
  Paragraph,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DocumentPicker from 'react-native-document-picker';

const CustomInput = ({placeholder, value, onChangeText, error, onBlur}) => (
  <View style={styles.inputContainer}>
    <PaperTextInput
      label={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      style={styles.input}
      error={error}
      onSubmitEditing={Keyboard.dismiss}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const FileInput = ({field, form, label}) => {
  return (
    <View style={styles.inputContainer}>
      <Title>{label}</Title>
      <Button
        icon="file"
        mode="outlined"
        // onPress={async () => {
        //   try {
        //     const result = await DocumentPicker.pick({
        //       type: [DocumentPicker.types.allFiles],
        //     });
        //     form.setFieldValue(field, result);
        //   } catch (err) {
        //     if (DocumentPicker.isCancel(err)) {
        //       // Handle cancelled action
        //     } else {
        //       throw err;
        //     }
        //   }
        // }}
      >
        Scegli un file
      </Button>
      {form.touched[field] && form.errors[field] && (
        <Text style={styles.errorText}>{form.errors[field]}</Text>
      )}
    </View>
  );
};

const RadioButtonCircle = ({checked, onPress}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.radioButton}>
      {checked && (
        <MaterialCommunityIcons
          name="checkbox-marked-circle"
          color="#FF9800"
          size={24}
        />
      )}
      {!checked && (
        <MaterialCommunityIcons
          name="checkbox-blank-circle-outline"
          color="#d8d8d8"
          size={24}
        />
      )}
    </View>
  </TouchableWithoutFeedback>
);

const QuoteForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepLineWidth, setStepLineWidth] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    const newWidth = (currentStep / 3) * 100;
    setStepLineWidth(newWidth);
  }, [currentStep]);

  const steps = [
    {
      title: 'Step 1',
      validationSchema: Yup.object().shape({
        name: Yup.string().required('Questo campo è obbligatorio'),
        surname: Yup.string().required('Questo campo è obbligatorio'),
        email: Yup.string()
          .required('Questo campo è obbligatorio')
          .email('Deve essere un indirizzo email valido'),
        phoneNumber: Yup.string().required('Questo campo è obbligatorio'),
      }),
      fields: ['name', 'surname', 'email', 'phoneNumber'],
    },
    {
      title: 'Step 2',
      validationSchema: Yup.object().shape({
        businessName: Yup.string().required('Questo campo è obbligatorio'),
        businessType: Yup.string().required('Questo campo è obbligatorio'),
      }),
      fields: ['businessName', 'businessType'],
    },
    {
      title: 'Step 3',
      validationSchema: Yup.object().shape({
        website: Yup.string().required('Questo campo è obbligatorio'),
      }),
      fields: ['website'],
    },
    {
      title: 'Step 4',
      validationSchema: Yup.object().shape({
        choice1: Yup.string().required('Seleziona una tipologia di sito'),
        choice2: Yup.string().required('Seleziona le funzionalità necessarie'),
        nomeSito: Yup.string().required('Questo campo è obbligatorio'),
        // logoFile: Yup.string().required('Questo campo è obbligatorio'),
      }),
      fields: ['choice1', 'choice2', 'nomeSito', 'logoFile'],
    },
  ];

  const fieldLabels = {
    name: 'Nome',
    surname: 'Cognome',
    email: 'Email',
    phoneNumber: 'Numero di telefono',
    businessName: 'Nome azienda',
    businessType: 'Tipo di azienda',
    website: 'Sito web',
    choice1: 'Choice 1',
    choice2: 'Choice 2',
    nomeSito: 'Nome Sito',
    logoFile: 'Logo File',
    // Aggiungi altre etichette secondo necessità
  };

  const handleNext = formikProps => {
    // Validate fields for the current step
    const stepValidationSchema = steps[currentStep].validationSchema;
    formikProps
      .validateForm(formikProps.values, {context: {stepValidationSchema}})
      .then(errors => {
        const isStepValid = !Object.keys(errors).length;

        // Check if all fields in the current step are touched
        const isStepTouched = steps[currentStep].fields.every(field => {
          // Check for string values for choice1, choice2, nomeSito, and logoFile
          if (
            field.startsWith('choice1') ||
            field === 'nomeSito' ||
            field === 'logoFile'
          ) {
            return typeof formikProps.values[field] === 'string';
          }
          return formikProps.touched[field];
        });

        if (isStepTouched && isStepValid) {
          // Proceed to the next step only after validation
          setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1));

          // Dismiss the keyboard
          Keyboard.dismiss();
        } else {
          // If the current step is not valid, set touched for all fields to display errors
          formikProps.setTouched(
            steps[currentStep].fields.reduce((acc, field) => {
              acc[field] = true;
              return acc;
            }, {}),
          );
          console.log(
            'Completa tutti i campi correttamente prima di procedere.',
          );
        }
      });
  };

  const handleSubmitForm = values => {
    console.log('Dati inviati:', values);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: '',
            surname: '',
            email: '',
            phoneNumber: '',
            businessName: '',
            businessType: '',
            website: '',
            choice1: '',
            choice2: '',
            nomeSito: '',
            logoFile: null,
          }}
          validationSchema={steps[currentStep].validationSchema}
          onSubmit={handleSubmitForm}>
          {formikProps => (
            <>
              <ProgressBar
                progress={(currentStep + 1) / steps.length}
                color="#FF9800"
                style={styles.progressBar}
              />
              <View style={styles.stepContainer}>
                {steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        {
                          backgroundColor:
                            index <= currentStep ? '#FF9800' : '#d8d8d8',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.stepText,
                          {
                            color:
                              index <= currentStep
                                ? theme.colors.surface
                                : '#8f8f8f',
                          },
                        ]}>
                        {index + 1}
                      </Text>
                    </View>
                    {index < steps.length - 1 && (
                      <View
                        style={{
                          width: stepLineWidth + '%',
                          backgroundColor: '#FF9800',
                        }}
                      />
                    )}
                  </View>
                ))}
              </View>

              <View>
                <Text
                  style={
                    styles.stepTitle
                  }>{`${steps[currentStep].title}:`}</Text>

                {steps[currentStep].fields.map((field, index) => (
                  <View key={index} style={styles.inputContainer}>
                    {field !== 'choice1' &&
                      field !== 'choice2' && ( // Condizione per escludere 'choice1' e 'choice2' dal rendering di CustomInput
                        <CustomInput
                          placeholder={fieldLabels[field]}
                          value={formikProps.values[field]}
                          onChangeText={formikProps.handleChange(field)}
                          onBlur={formikProps.handleBlur(field)}
                          error={
                            formikProps.touched[field] &&
                            formikProps.errors[field]
                          }
                        />
                      )}
                    {field === 'choice1' && (
                      <View style={styles.choicesContainer}>
                        <Title>Scegli la tipologia di sito</Title>
                        {/* Aggiungi qui le opzioni di scelta */}
                        {['Sito Web Aziendale Standard', 'Altra Opzione'].map(
                          (option, idx) => (
                            <Card key={idx} style={styles.card}>
                              <Card.Content>
                                <Paragraph>{option}</Paragraph>
                                <TouchableWithoutFeedback
                                  onPress={() =>
                                    formikProps.setFieldValue(
                                      field,
                                      option.toLowerCase(), // o come preferisci gestire i valori
                                    )
                                  }>
                                  <RadioButtonCircle
                                    checked={
                                      formikProps.values[field] ===
                                      option.toLowerCase()
                                    }
                                    onPress={() =>
                                      formikProps.setFieldValue(
                                        field,
                                        option.toLowerCase(),
                                      )
                                    }
                                  />
                                </TouchableWithoutFeedback>
                              </Card.Content>
                            </Card>
                          ),
                        )}
                      </View>
                    )}

                    {field === 'choice2' && (
                      <View style={styles.choicesContainer}>
                        <Title>Scegli le funzionalità</Title>

                        {['Newsletter', 'Blog'].map((option, idx) => (
                          <Card key={idx} style={styles.card}>
                            <Card.Content>
                              <Paragraph>{option}</Paragraph>
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  formikProps.setFieldValue(
                                    field,
                                    option.toLowerCase(), // o come preferisci gestire i valori
                                  )
                                }>
                                <RadioButtonCircle
                                  checked={
                                    formikProps.values[field] ===
                                    option.toLowerCase()
                                  }
                                  onPress={() =>
                                    formikProps.setFieldValue(
                                      field,
                                      option.toLowerCase(),
                                    )
                                  }
                                />
                              </TouchableWithoutFeedback>
                            </Card.Content>
                          </Card>
                        ))}
                        {formikProps.touched[field] &&
                          formikProps.errors[field] && (
                            <Text style={styles.errorText}>
                              {formikProps.errors[field]}
                            </Text>
                          )}
                      </View>
                    )}
                    {field === 'logoFile' && (
                      <FileInput
                        field="logoFile"
                        form={formikProps}
                        label={fieldLabels[field]}
                      />
                    )}
                  </View>
                ))}

                <View style={styles.buttonContainer}>
                  {currentStep > 0 && (
                    <Button
                      mode="contained"
                      onPress={() => setCurrentStep(prevStep => prevStep - 1)}
                      style={styles.buttonPrevius}>
                      Indietro
                    </Button>
                  )}

                  {currentStep < steps.length - 1 && (
                    <Button
                      mode="contained"
                      onPress={() => handleNext(formikProps)}
                      style={styles.button}
                      textColor="#FF9800">
                      Procedi
                    </Button>
                  )}

                  {currentStep > 2 && (
                    <Button
                      mode="contained"
                      onPress={() => formikProps.handleSubmit()}
                      style={styles.button}
                      textColor="#FF9800">
                      Invia la richiesta
                    </Button>
                  )}
                </View>
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    maxWidth: '100%',
    minWidth: '100%',
    paddingVertical: 40,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 50,
  },
  stepItem: {
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 2,
  },
  progressBar: {
    width: '70%',
    display: 'flex',
    alignSelf: 'center',
    position: 'relative',
    top: 15,
    zIndex: 0,
  },
  button: {
    borderRadius: 0,
    borderColor: '#FF9800',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  buttonPrevius: {
    borderRadius: 0,
    backgroundColor: '#a7a7a7',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  choicesContainer: {
    marginTop: 10,
  },
  card: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default QuoteForm;
