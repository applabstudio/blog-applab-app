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
import {Card, Title, Paragraph} from 'react-native-paper';

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
        <TouchableOpacity
          key={article.id}
          onPress={() =>
            navigation.navigate('ArticleDetail', {articleId: article.id})
          }>
          <Card style={styles.articleCard}>
            <Card.Cover source={{uri: mediaUrl}} />
            <Card.Content>
              <Title>{he.decode(article.title.rendered)}</Title>
              <Paragraph>
                {he.decode(article.excerpt.rendered.replace(/<[^>]*>/g, ''))}
              </Paragraph>
            </Card.Content>
          </Card>
        </TouchableOpacity>
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
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  articleCard: {
    marginBottom: 8,
    elevation: 4,
  },
});

export default Home;
