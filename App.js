import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import UnauthStack from "./routes/unauthRoutes/UnauthStack";
import AuthTabs from "./routes/authRoutes/AuthTabs";
import { UserContext } from "./context/UserContext";
import ChatsStack from "./routes/authRoutes/ChatsStack";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message";

export default function App() {
  const [user, setUser] = useState("");

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "green", width: "95%" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 20,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red", width: "95%" }}
        text1Style={{
          fontSize: 20,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={{ borderLeftColor: "gold", width: "95%" }}
        text1Style={{
          fontSize: 20,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        setUser(user);
        // console.log(user);
      } else {
        // User is signed out
        // ...
        console.log("user signed out");
        setUser("");
      }
    });

    return unsubAuth;
  }, []);

  return (
    <>
      <NavigationContainer>
        {!user ? <UnauthStack /> : <ChatsStack />}
        {/* {!user ? <UnauthStack /> : <AuthTabs />} */}
        <StatusBar style="auto" />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
