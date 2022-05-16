import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../../screens/unauthscreens/LogInScreen";
import SignUpScreen from "../../screens/unauthscreens/SignUpScreen";

const Stack = createNativeStackNavigator();

const UnauthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default UnauthStack;
