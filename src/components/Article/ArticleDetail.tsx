import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import he from 'he';
import {Title, Button} from 'react-native-paper';
import HTML from 'react-native-render-html';
import CustomButton from '../UI/CustomButton';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-toast-message';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';

const ArticleDetail = ({route, navigation}) => {
  const {articleId} = route.params;
  const toastRef = useRef();
  const [loading, setLoading] = useState(true);
  const combinedArticleId = articleId || uuidv4();
  const [article, setArticle] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true); // Imposta lo stato di caricamento su true
        const response = await axios.get(
          `https://www.applabstudio.com/wp-json/wp/v2/posts/${combinedArticleId}`,
        );
        setArticle(response.data);
        const mediaResponse = await axios.get(
          `https://applabstudio.com/wp-json/wp/v2/media/${response.data.featured_media}`,
        );
        setMediaUrl(mediaResponse.data.source_url);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Imposta lo stato di caricamento su false dopo il completamento
      }
    };
    const fetchComments = async () => {
      try {
        const snapshot = await firestore()
          .collection('comments')
          .where('articleId', '==', combinedArticleId)
          .get();

        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(commentsData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticle();
    fetchComments();
  }, [combinedArticleId]);

  const submitComment = async () => {
    if (commentText.trim() === '') {
      // Il commento è vuoto, mostra il toast
      Toast.show({
        type: 'info',
        text1: 'Attenzione',
        text2: 'Il commento non può essere vuoto',
        visibilityTime: 2000,
      });
      return;
    }
    try {
      await firestore().collection('comments').add({
        articleId: combinedArticleId,
        text: commentText,
      });

      setCommentText('');

      const snapshot = await firestore()
        .collection('comments')
        .where('articleId', '==', combinedArticleId)
        .get();

      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(commentsData);
      Toast.show({
        type: 'success',
        text1: 'Commento inviato',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.log(error);
    }
  };
  if (!article) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {loading ? ( // Mostra lo skeleton loading durante il caricamento
        <SkeletonPlaceholder>
          <View style={styles.thumbnailWrapper}>
            <View style={styles.skeletonThumbnail} />
            <View style={styles.titleContainer}>
              <View style={styles.skeletonTitle} />
            </View>
          </View>
        </SkeletonPlaceholder>
      ) : (
        // Mostra i dati effettivi dopo il caricamento
        <View style={styles.thumbnailWrapper}>
          <Image style={styles.thumbnail} source={{uri: mediaUrl}} />
          <View style={styles.titleContainer}>
            <Title style={styles.title}>
              {he.decode(article.title.rendered)}
            </Title>
          </View>
        </View>
      )}
      <ScrollView>
        <View style={styles.contentContainer}>
          <HTML
            source={{html: article.content.rendered}}
            tagsStyles={tagsStyles}
            contentWidth={contentWidth}
          />
          <CustomButton
            title="Contattaci"
            onPress={() => console.log('Contattaci')}
            navigation={navigation} // Passa la prop "navigation" al componente "CustomButton"
          />
          <Text style={styles.commentTitle}>Commenti</Text>
          {comments.map(comment => (
            <View style={styles.commentContainer} key={comment.id}>
              <Text style={styles.commentText}>{comment.text}</Text>
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentDate}>
                  {moment(comment.date).format('MMMM Do YYYY, h:mm:ss a')}
                </Text>
              </View>
            </View>
          ))}
          <TextInput
            value={commentText}
            onChangeText={text => setCommentText(text)}
            placeholder="Inserisci un commento"
            style={styles.commentInput}
          />
          <Button
            title="Invia Commento"
            onPress={submitComment}
            style={styles.buttonSendComment}>
            <FontAwesomeIcon icon={faPaperPlane} size={16} color={'#ffffff'} />
            <Text style={styles.buttonSendCommentText}>Invia</Text>
          </Button>
        </View>
      </ScrollView>
      {toastRef.current && <Toast ref={toastRef} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Imposta il colore di sfondo desiderato
    padding: 8,
  },
  thumbnailWrapper: {
    backgroundColor: '#F0F0F0', // Imposta un colore di sfondo chiaro o trasparente
    borderRadius: 8,
    marginBottom: 16,
  },
  thumbnail: {
    height: 178,
    borderRadius: 8,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    marginBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 8, // Aggiunto padding orizzontale per spaziare il contenuto rispetto ai bordi
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333333',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  commentContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  commentText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333333',
  },
  commentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentAuthor: {
    fontSize: 14,
    color: '#666666',
  },
  commentDate: {
    fontSize: 12,
    color: '#000',
  },
  commentInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonSendComment: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  buttonSendCommentText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const tagsStyles = {
  h1: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  h2: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  h3: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  h4: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
  h5: {fontSize: 14, fontWeight: 'bold', marginBottom: 10},
  h6: {fontSize: 12, fontWeight: 'bold', marginBottom: 10},
  p: {fontSize: 16, marginBottom: 10, border: '1px solid red'},
  ul: {
    marginLeft: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: '1px solid red',
  },
  li: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: '1px solid red',
  },
  ol: {
    marginLeft: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: '1px solid red',
  },
  a: {
    border: '1px solid red',
  },
};

const contentWidth = 400; // Larghezza del contenuto HTML

export default ArticleDetail;
