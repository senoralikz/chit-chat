import { useEffect, useState, useContext } from "react";
import { Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsStack from "./ChatsStack";
import ContactsStack from "./ContactsStack";
import ProfileStack from "./ProfileStack";
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
        // headerShown: false,
        headerTitleStyle: {
          fontSize: 36,
          fontWeight: "800",
        },
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
            // marginVertical: 2,
            justifyContent: "center",
            // alignItems: "center",
            // alignSelf: "center",
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
          headerShown: false,
          tabBarAccessibilityLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-friends" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
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
