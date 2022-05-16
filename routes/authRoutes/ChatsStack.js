import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../../screens/authscreens/ChatScreen";
import ChatsListScreen from "../../screens/authscreens/ChatsListScreen";

const Stack = createNativeStackNavigator();

const ChatsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ChatsListScreen">
      <Stack.Screen
        name="ChatsListScreen"
        component={ChatsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: "ChitterChat",
          headerBackTitleVisible: false,
          // headerTintColor: "#22a6b3",
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatsStack;
