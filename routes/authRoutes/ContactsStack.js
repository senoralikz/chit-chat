import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactsListScreen from "../../screens/authScreens/ContactsListScreen";
import AddContactScreen from "../../screens/authScreens/AddContactScreen";

const Stack = createNativeStackNavigator();

const ContactsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ContactsListScreen">
      <Stack.Screen name="ContactsListScreen" component={ContactsListScreen} />
      <Stack.Screen
        name="AddContactScreen"
        component={AddContactScreen}
        options={{
          title: "Add Friend",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactsStack;
