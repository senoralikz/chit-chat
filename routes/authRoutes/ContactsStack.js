import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactsScreen from "../../screens/authScreens/ContactsScreen";
import AddContactScreen from "../../screens/authScreens/AddContactScreen";

const Stack = createNativeStackNavigator();

const ContactsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ContactsScreen">
      <Stack.Screen
        name="ContactsScreen"
        component={ContactsScreen}
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
