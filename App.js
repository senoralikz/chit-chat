import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import UnauthStack from "./routes/unauthRoutes/UnauthStack";
import AuthTabs from "./routes/authRoutes/AuthTabs";
import { UnreadMsgContext } from "./context/UnreadMsgContext";
import ChatsStack from "./routes/authRoutes/ChatsStack";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Avatar } from "react-native-elements";

export default function App() {
  const [user, setUser] = useState("");
  const [totalUnreadMsgs, setTotalUnreadMsgs] = useState(0);

  const toastConfig = {
    newMessage: ({ text1, text2, props }) => (
      <View
        style={{
          height: 60,
          width: "95%",
          backgroundColor: "#fff",
          borderColor: "#eee",
          borderRadius: 10,
          elevation: 3,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#333",
          shadowOpacity: 0.4,
          shadowRadius: 2,

          // marginVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingTop: 13,
            paddingLeft: 10,
          }}
        >
          <Avatar
            source={{ uri: props.photoURL }}
            size="small"
            rounded
            containerStyle={{ marginRight: 10 }}
          />
          <View style={{ width: "85%" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text1}
            </Text>
            <Text
              style={{ fontSize: 15 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text2}
            </Text>
          </View>
        </View>
      </View>
    ),
    // newMessage: (props) => (
    //   <BaseToast
    //     {...props}
    //     style={{
    //       borderLeftColor: "#6ab04c",
    //       width: "95%",
    //       backgroundColor: "#fff",
    //     }}
    //     contentContainerStyle={{ paddingHorizontal: 15 }}
    //     text1Style={{
    //       fontSize: 20,
    //       color: "#000",
    //     }}
    //     text2Style={{
    //       fontSize: 15,
    //       color: "#000",
    //     }}
    //   />
    // ),
    success: (props) => (
      <SuccessToast
        {...props}
        style={{
          borderLeftColor: "#6ab04c",
          width: "95%",
          backgroundColor: "#6ab04c",
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 20,
          color: "#fff",
        }}
        text2Style={{
          fontSize: 15,
          color: "#fff",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#eb4d4b",
          width: "95%",
          backgroundColor: "#eb4d4b",
        }}
        text1Style={{
          fontSize: 20,
          color: "#fff",
        }}
        text2Style={{
          fontSize: 15,
          color: "#fff",
        }}
      />
    ),
    info: (props) => (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: "#feca57",
          width: "95%",
          backgroundColor: "#feca57",
        }}
        text1Style={{
          fontSize: 20,
          color: "#fff",
        }}
        text2Style={{
          fontSize: 15,
          color: "#fff",
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
      <UnreadMsgContext.Provider
        value={{ totalUnreadMsgs, setTotalUnreadMsgs }}
      >
        <SafeAreaProvider>
          <NavigationContainer>
            {!user ? <UnauthStack /> : <ChatsStack />}
            {/* {!user ? <UnauthStack /> : <AuthTabs />} */}
            <StatusBar style="auto" />
          </NavigationContainer>
          <Toast config={toastConfig} position="bottom" bottomOffset={85} />
        </SafeAreaProvider>
      </UnreadMsgContext.Provider>
    </>
  );
}
