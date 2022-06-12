import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/authScreens/ProfileScreen";
import ChangePasswordScreen from "../../screens/authScreens/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

const ContactsStack = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactsStack;
