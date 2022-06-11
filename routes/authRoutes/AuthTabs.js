import { useEffect, useState, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsStack from "./ChatsStack";
import ContactsStack from "./ContactsStack";
import ProfileScreen from "../../screens/authScreens/ProfileScreen";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import ChatsListScreen from "../../screens/authScreens/ChatsListScreen";
import { UnreadMsgContext } from "../../context/UnreadMsgContext";
import { db, auth } from "../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Tab = createBottomTabNavigator();

const AuthTabs = () => {
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);

  return (
    <Tab.Navigator
      initialRouteName="ChatsTab"
      shifting={true}
      labeled={false}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#22a6b3",
        tabBarInactiveTintColor: "#bdc3c7",
      }}
    >
      <Tab.Screen
        name="ChatsTab"
        component={ChatsListScreen}
        options={{
          tabBarAccessibilityLabel: "Chats",
          tabBarBadge: totalUnreadMsgs,
          tabBarBadgeStyle: {
            backgroundColor: "#9b59b6",
            display: totalUnreadMsgs === 0 ? "none" : "flex",
            // display: totalUnreadMsgs > 0 ? "flex" : "none",
            // paddingVertical: 2,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-chatbubbles" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactsTab"
        component={ContactsStack}
        options={{
          tabBarAccessibilityLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-friends" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarAccessibilityLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthTabs;
