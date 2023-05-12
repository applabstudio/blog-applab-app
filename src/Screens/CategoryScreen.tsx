import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {ListItem} from 'react-native-elements';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTag, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import styled from 'react-native-styled-components';

const Container = styled(View, {
  flex: 1,
  backgroundColor: '#ffffff',
});

const LoadingContainer = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const LoadingText = styled(Text, {
  fontSize: 16,
  marginTop: 10,
  color: '#888888',
});

const CategoryItem = styled(ListItem, {
  backgroundColor: '#ffffff',
  borderRadius: 10,
  marginVertical: 5,
  marginHorizontal: 10,
  shadowColor: '#000000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
});

const CategoryTitle = styled(ListItem.Title, {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333333',
});

const CategorySubtitle = styled(ListItem.Subtitle, {
  fontSize: 14,
  color: '#666666',
});

const CategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWordPressCategories();
  }, []);

  const fetchWordPressCategories = async () => {
    try {
      const response = await fetch(
        'https://www.applabstudio.com/wp-json/wp/v2/categories',
      );
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderCategoryItem = ({item}) => (
    <CategoryItem bottomDivider>
      <FontAwesomeIcon icon={faTag} size={24} color={'#888888'} />
      <ListItem.Content>
        <CategoryTitle>{item.name}</CategoryTitle>
        <CategorySubtitle>{item.description}</CategorySubtitle>
      </ListItem.Content>
      <FontAwesomeIcon icon={faArrowRight} size={24} color={'#888888'} />
    </CategoryItem>
  );

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#888888" />
        <LoadingText>Caricamento categorie...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
      />
    </Container>
  );
};

export default CategoryScreen;
