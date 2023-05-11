import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {List, Divider} from 'react-native-paper';
import axios from 'axios';
import he from 'he';

type Article = {
  id: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
};

type Media = {
  id: number;
  source_url: string;
};

const ArticleScreen = ({navigation}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [media, setMedia] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await axios.get<Article[]>(
        'https://applabstudio.com/wp-json/wp/v2/posts',
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

  // const handleArticlePress = article => {
  //   navigation.navigate('ArticleDetail', {article});
  // };

  // Nella schermata ArticleScreen
  const renderArticle = ({item}: {item: Article}) => (
    <View>
      <List.Item
        title={he.decode(item.title.rendered)}
        description={he.decode(item.excerpt.rendered.replace(/<[^>]*>/g, ''))}
        onPress={() => navigation.navigate('ArticleDetail', {article: item})} // Passa l'oggetto article come parametro
        left={() =>
          media[item.featured_media] ? (
            <Image
              source={{uri: media[item.featured_media]}}
              style={{width: 50, height: 50}}
            />
          ) : (
            <View style={{width: 50, height: 50}} />
          )
        }
      />
      <Divider />
    </View>
  );

  return (
    <View>
      <Text>Lista articoli:</Text>
      <List.Section>
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={item => item.id.toString()}
        />
      </List.Section>
    </View>
  );
};

export default ArticleScreen;
