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

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        setUser(user);
        console.log(user);
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
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        {!user ? <UnauthStack /> : <ChatsStack />}
        {/* {!user ? <UnauthStack /> : <AuthTabs />} */}
        <StatusBar style="auto" />
      </NavigationContainer>
    </UserContext.Provider>
  );
}