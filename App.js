import { View, Text, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import UnauthStack from "./routes/unauthRoutes/UnauthStack";
import AuthTabs from "./routes/authRoutes/AuthTabs";
import { UnreadMsgContext } from "./context/UnreadMsgContext";
import ChatsStack from "./routes/authRoutes/ChatsStack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Avatar } from "react-native-elements";
import { ToastProvider } from "react-native-toast-notifications";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MenuProvider } from "react-native-popup-menu";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [user, setUser] = useState("");
  const [totalUnreadMsgs, setTotalUnreadMsgs] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        setExpoPushToken(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
      alert(error.message);
      console.error(
        error.code,
        "-- error getting push token --",
        error.message
      );
    }
  };

  const renderType = {
    newMessage: (toast) => (
      <View
        style={{
          height: 50,
          width: "95%",
          backgroundColor: "#fff",
          borderColor: "#eee",
          borderRadius: 10,
          elevation: 3,
          shadowOffset: { width: 2, height: 2 },
          shadowColor: "#333",
          shadowOpacity: 0.4,
          shadowRadius: 2,
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            // width: "85%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignSelf: "center" }}>
              <Avatar
                source={{ uri: toast.photoURL }}
                size="small"
                rounded
                containerStyle={{ marginRight: 10 }}
              />
            </View>
            <View>
              <Text
                style={{ fontWeight: "bold", fontSize: 20 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {toast.displayName}
              </Text>
              <Text
                style={{ fontSize: 15 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {toast.message}
              </Text>
            </View>
          </View>
          <View>
            <Text>{toast.createdAt}</Text>
          </View>
        </View>
      </View>
    ),
  };

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) =>
  //     setExpoPushToken(token)
  //   );

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

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
        // console.log("user signed out");
        setUser("");
      }
    });

    return unsubAuth;
  }, []);

  return (
    <UnreadMsgContext.Provider value={{ totalUnreadMsgs, setTotalUnreadMsgs }}>
      <ToastProvider
        renderType={renderType}
        offsetBottom={80}
        offsetTop={50}
        textStyle={{ fontSize: 16 }}
        duration={3000}
        successIcon={
          <Ionicons name="checkmark-circle-sharp" size={24} color="#fff" />
        }
        dangerIcon={<Ionicons name="md-warning" size={24} color="#fff" />}
        warningIcon={<MaterialIcons name="error" size={24} color="#fff" />}
      >
        <MenuProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              {!user ? <UnauthStack /> : <ChatsStack />}
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </MenuProvider>
      </ToastProvider>
    </UnreadMsgContext.Provider>
  );
}
