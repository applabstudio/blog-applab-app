import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {Divider} from 'react-native-paper';
import axios from 'axios';
import he from 'he';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useNavigation} from '@react-navigation/native';

type Article = {
  id: number;
  title: {rendered: string};
  excerpt: {rendered: string};
  featured_media: number;
};
const ArticleScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [media, setMedia] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Aggiungi lo stato
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const animatedContainerStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          'https://applabstudio.com/wp-json/wp/v2/posts',
        );
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      const mediaData = {};
      for (const article of articles) {
        try {
          const response = await axios.get(
            `https://applabstudio.com/wp-json/wp/v2/media/${article.featured_media}`,
          );
          mediaData[article.featured_media] = response.data.source_url;
        } catch (error) {
          console.error(error);
        }
      }
      setMedia(mediaData);
    };
    fetchMedia();
  }, [articles]);

  // Funzione per ricaricare gli articoli
  const handleRefresh = async () => {
    setRefreshing(true); // Imposta lo stato refreshing a true

    try {
      const response = await axios.get(
        'https://applabstudio.com/wp-json/wp/v2/posts',
      );
      setArticles(response.data);
    } catch (error) {
      console.error(error);
    }

    setRefreshing(false); // Imposta lo stato refreshing a false dopo aver completato la ricarica
  };

  const navigation = useNavigation();
  const goArticle = article => {
    navigation.navigate('ArticleDetail', {articleId: article.id});
  };

  const renderArticle = ({item}: {item: Article}) => (
    <Animated.View style={[styles.articleContainer, animatedContainerStyle]}>
      {media[item.featured_media] ? (
        <Image
          source={{uri: media[item.featured_media]}}
          style={styles.articleImage}
        />
      ) : (
        <View style={styles.articleImagePlaceholder} />
      )}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>
          {he.decode(item.title.rendered)}
        </Text>
        <Text style={styles.articleExcerpt}>
          {he.decode(item.excerpt.rendered.replace(/<[^>]*>/g, ''))}
        </Text>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => goArticle(item)}>
          <View style={styles.readMoreButtonContent}>
            <FontAwesomeIcon icon={faEye} size={16} color={'#ffffff'} />
            <Text style={styles.readMoreButtonText}>Leggi di più</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <SkeletonPlaceholder backgroundColor="#f2f2f2" highlightColor="#e3e3e3">
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((_, index) => (
            <View style={styles.skeletonArticleContainer} key={index}>
              <View style={styles.skeletonArticleImage} />
              <View style={styles.skeletonArticleContent}>
                <View style={styles.skeletonArticleTitle} />
                <Text style={styles.skeletonArticleExcerpt} />
              </View>
            </View>
          ))}
        </View>
      </SkeletonPlaceholder>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.container}
      // eslint-disable-next-line react/no-unstable-nested-components
      ItemSeparatorComponent={() => <Divider style={styles.divider} />}
      refreshControl={
        // Aggiungi il refreshControl alla FlatList
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#888888']} // Opzionale: puoi personalizzare i colori dello spinner di caricamento
          tintColor="#888888"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonArticleContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonArticleImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 16,
  },
  skeletonArticleContent: {
    flex: 1,
  },
  skeletonArticleTitle: {
    width: '70%',
    height: 18,
    marginBottom: 8,
  },
  skeletonArticleExcerpt: {
    width: '100%',
    height: 14,
  },
  articleContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  articleImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#CCCCCC',
    borderRadius: 4,
  },
  articleContent: {
    flex: 1,
    marginLeft: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333',
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#666666',
  },
  divider: {
    marginVertical: 8,
  },
  readMoreButton: {
    display: 'flex',
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
  },
  readMoreButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  readMoreButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ArticleScreen;
