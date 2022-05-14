import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/authscreens/ChatsScreen";
import ContactsScreen from "../screens/authscreens/ContactsScreen";
import SettingsScreen from "../screens/authscreens/SettingsScreen";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
    // </Stack.Navigator>
    <Tab.Navigator
      initialRouteName="ChatsScreen"
      shifting={true}
      labeled={false}
      activeColor="#22a6b3"
      inactiveColor="#bdc3c7"
      barStyle={{ height: 80, backgroundColor: "#fff" }}
    >
      <Tab.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{
          tabBarAccessibilityLabel: "Chats",
          tabBarBadge: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-chatbubbles" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={{
          tabBarAccessibilityLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="contacts" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarAccessibilityLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthStack;
