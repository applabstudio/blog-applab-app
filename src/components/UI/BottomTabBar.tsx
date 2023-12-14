import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faNewspaper,
  faEnvelope,
  faTag,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

import Home from '../../Screens/Home';
import ArticleScreen from '../../Screens/ArticleScreen';
import ContactScreen from '../../Screens/ContactScreen';
import CategoryScreen from '../../Screens/CategoryScreen';
import AccountScreen from '../../Screens/AccountScreen';

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
        headerShown: false,
        tabBarIcon: ({color, focused}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = faHome;
          } else if (route.name === 'News') {
            iconName = faNewspaper;
          } else if (route.name === 'Contact') {
            iconName = faEnvelope;
          } else if (route.name === 'Category') {
            iconName = faTag;
          } else if (route.name === 'Account') {
            iconName = faUserCircle;
          }

          return renderTabBarIcon(iconName, focused ? '#FF9800' : '#ccc');
        },
        tabBarActiveTintColor: '#FF9800',
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
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        listeners={{
          tabPress: () => handleTabPress('Category'),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        listeners={{
          tabPress: () => handleTabPress('Account'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabBar;
