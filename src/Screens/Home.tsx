import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import he from 'he';
import {Title, Paragraph} from 'react-native-paper';
import {Image} from 'react-native-elements';

type Article = {
  id: number;
  title: {rendered: string};
  excerpt: {rendered: string};
  featured_media: number;
};

type Media = {
  source_url: string;
};

const Home = ({navigation}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [media, setMedia] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await axios.get<Article[]>(
        'https://www.applabstudio.com/wp-json/wp/v2/posts',
      );
      setArticles(response.data);
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      const mediaData: {[key: number]: string} = {};
      for (const article of articles) {
        const response = await axios.get<Media>(
          `https://applabstudio.com/wp-json/wp/v2/media/${article.featured_media}`,
        );
        mediaData[article.featured_media] = response.data.source_url;
      }
      setMedia(mediaData);
    };
    fetchMedia();
  }, [articles]);

  const renderArticles = () => {
    return articles.map(article => {
      const mediaUrl = media[article.featured_media];
      return (
        <View key={article.id} style={styles.articleCard}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ArticleDetail', {articleId: article.id})
            }>
            <Image source={{uri: mediaUrl}} style={styles.articleImage} />
            <View style={styles.articleContent}>
              <Title>{he.decode(article.title.rendered)}</Title>
              <Paragraph>
                {he.decode(article.excerpt.rendered.replace(/<[^>]*>/g, ''))}
              </Paragraph>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ultimi articoli</Text>
      <ScrollView>{renderArticles()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  articleCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
});

export default Home;
