import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, ScrollView, Text} from 'react-native';
import axios from 'axios';
import he from 'he';
import {Title} from 'react-native-paper';
import HTML from 'react-native-render-html';
import CustomButton from '../UI/CustomButton';

const ArticleDetail = ({route, navigation}) => {
  const {articleId} = route.params;
  const [article, setArticle] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `https://www.applabstudio.com/wp-json/wp/v2/posts/${articleId}`,
        );
        setArticle(response.data);
        const mediaResponse = await axios.get(
          `https://applabstudio.com/wp-json/wp/v2/media/${response.data.featured_media}`,
        );
        setMediaUrl(mediaResponse.data.source_url);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (!article) {
    return (
      <View style={styles.container}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mediaUrl && <Image style={styles.thumbnail} source={{uri: mediaUrl}} />}
      <ScrollView>
        <View style={styles.contentContainer}>
          <Title>{he.decode(article.title.rendered)}</Title>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 8,
  },
  thumbnail: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  contentContainer: {
    marginBottom: 16,
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
