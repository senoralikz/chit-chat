import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../../screens/authScreens/ChatScreen";
import GroupChatScreen from "../../screens/authScreens/GroupChatScreen";
import GroupChatInfoScreen from "../../screens/authScreens/GroupChatInfoScreen";
import AuthTabs from "./AuthTabs";
import SelectChattersListScreen from "../../screens/authScreens/SelectChattersListScreen";

const Stack = createNativeStackNavigator();

const ChatsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatsListScreen">
      <Stack.Screen
        name="ChatsListScreen"
        component={AuthTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectChattersListScreen"
        component={SelectChattersListScreen}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerBackVisible: false }}
      />
      <Stack.Screen
        name="GroupChatScreen"
        component={GroupChatScreen}
        options={{ headerBackVisible: false }}
      />
      <Stack.Screen
        name="GroupChatInfoScreen"
        component={GroupChatInfoScreen}
        options={{ headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
};

export default ChatsStack;
