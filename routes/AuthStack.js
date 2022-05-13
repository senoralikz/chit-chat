import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/ChatsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    // <Stack.Navigator screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="ChatsScreen" component={ChatsScreen} />
    // </Stack.Navigator>
    <Tab.Navigator initialRouteName="ChatsScreen">
      <Tab.Screen name="ChatsScreen" component={ChatsScreen} />
      <Tab.Screen name="ContactsScreen" component={ContactsScreen} />
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AuthStack;
