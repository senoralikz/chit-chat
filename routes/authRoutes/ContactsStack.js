import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactsListScreen from "../../screens/authScreens/ContactsListScreen";
import AddContactScreen from "../../screens/authScreens/AddContactScreen";
import CreateChatScreen from "../../screens/authScreens/SelectChattersScreen";

const Stack = createNativeStackNavigator();

const ContactsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ContactsListScreen">
      <Stack.Screen
        name="ContactsListScreen"
        component={ContactsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddContactScreen"
        component={AddContactScreen}
        options={{
          title: "Add Friend",
          headerBackTitleVisible: false,
          // headerTintColor: "#22a6b3",
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactsStack;
