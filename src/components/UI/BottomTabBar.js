import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faNewspaper,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import Home from '../../Screens/Home';
import ArticleScreen from '../../Screens/ArticleScreen.tsx';
import ContactScreen from '../../Screens/ContactScreen';

const Tab = createBottomTabNavigator();

const BottomTabBar = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const renderTabBarIcon = (iconName, color) => {
    return <FontAwesomeIcon icon={iconName} size={24} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = faHome;
          } else if (route.name === 'News') {
            iconName = faNewspaper;
          } else if (route.name === 'Contact') {
            iconName = faEnvelope;
          }
          return renderTabBarIcon(iconName, focused ? '#000' : '#ccc');
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#ccc',
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          display: 'flex',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          tabPress: () => handleTabPress('Home'),
        }}
      />
      <Tab.Screen
        name="News"
        component={ArticleScreen}
        listeners={{
          tabPress: () => handleTabPress('News'),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        listeners={{
          tabPress: () => handleTabPress('Contact'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabBar;
