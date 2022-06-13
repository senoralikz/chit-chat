import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../../screens/authScreens/ChatScreen";
import ChatsListScreen from "../../screens/authScreens/ChatsListScreen";
import AuthTabs from "./AuthTabs";
import CreateChatScreen from "../../screens/authScreens/CreateChatScreen";
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
        name="SelectChattersScreen"
        component={SelectChattersListScreen}
        options={{
          title: "Select Chatters",
          // headerTintColor: "#22a6b3",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: "ChitterChat",
          // headerBackTitleVisible: false,
          headerBackVisible: false,
          // headerTintColor: "#22a6b3",
        }}
      />
      <Stack.Screen
        name="CreateChatScreen"
        component={CreateChatScreen}
        options={{
          title: "New ChitterChat",
          headerBackTitleVisible: false,
          // headerTintColor: "#22a6b3",
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatsStack;
