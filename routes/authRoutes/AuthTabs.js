import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsStack from "./ChatsStack";
import ContactsStack from "./ContactsStack";
import ProfileScreen from "../../screens/authscreens/ProfileScreen";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const AuthTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
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
        component={ChatsStack}
        options={{
          tabBarAccessibilityLabel: "Chats",
          tabBarBadge: 3,
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
