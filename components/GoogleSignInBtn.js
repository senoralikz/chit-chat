import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
} from "firebase/auth";
import {
  setDoc,
  doc,
  onSnapshot,
  query,
  collection,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button, SocialIcon } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInBtn = ({ googleModalVisible, setGoogleModalVisible }) => {
  const [displayName, setDisplayName] = useState("");
  const [displayNameAvailable, setDisplayNameAvailable] = useState(true);

  const usersRef = collection(db, "users");
  const qDisplayName = query(usersRef, where("displayName", "==", displayName));

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId:
      "222411167592-a3d60vq19ouqusba6ecrvqlopqj567hn.apps.googleusercontent.com",
    expoClientId:
      "222411167592-bcur0kqlcuc6asbhcfl0ned6q2i4qgqv.apps.googleusercontent.com",
  });

  // useEffect(() => {
  //   const unsubDisplayNames = onSnapshot(qDisplayName, (querySnapshot) => {
  //     let userDisplayNames = [];
  //     querySnapshot.docs.forEach((doc) => {
  //       userDisplayNames.push(doc.data().displayName);
  //     });

  //     if (userDisplayNames.length > 0) {
  //       setDisplayNameAvailable(false);
  //       console.log(userDisplayNames);
  //     } else {
  //       setDisplayNameAvailable(true);
  //     }
  //   });

  //   return unsubDisplayNames;
  // }, [displayName]);

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;

  //     const credential = GoogleAuthProvider.credential(id_token);
  //     signInWithCredential(auth, credential)
  //       .then(() =>
  //         updateProfile(auth.currentUser, {
  //           displayName: displayName,
  //         })
  //       )
  //       .then(() => addUserToCollection(auth.currentUser));
  //   }
  // }, [response]);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() =>
        addUserToCollection(auth.currentUser)
      );
    }
  }, [response]);

  const addUserToCollection = async (user) => {
    try {
      await setDoc(doc(db, `users/${user.uid}`), {
        email: user.email,
        photoURL: user.photoURL,
        displayName: displayName,
        userId: user.uid,
      });
    } catch (error) {
      console.error(
        error.code,
        "--- trouble adding user to collection ---",
        error.message
      );
      Alert.alert(error.code, error.message, { text: "Ok" });
    }
  };

  return (
    // <Modal
    //   animationType="slide"
    //   presentationStyle="formSheet"
    //   visible={googleModalVisible}
    //   onRequestClose={() => {
    //     setGoogleModalVisible(false);
    //   }}
    // >
    //   <View style={{ flexDirection: "row" }}>
    //     <Pressable onPress={() => setGoogleModalVisible(false)}>
    //       <View style={{ justifyContent: "center" }}>
    //         <Ionicons name="chevron-back" size={32} color="#22a6b3" />
    //       </View>
    //     </Pressable>
    //     <View style={{ justifyContent: "center", alignSelf: "center" }}>
    //       <Text style={{ fontSize: 36, fontWeight: "800" }}>
    //         Add Display Name
    //       </Text>
    //     </View>
    //   </View>
    //   <Text style={{ fontSize: 18, paddingHorizontal: 15, marginTop: 50 }}>
    //     Enter a unique display name to continue signing in with Google
    //   </Text>
    //   <KeyboardAvoidingView
    //     behavior={Platform.OS === "ios" ? "padding" : "height"}
    //     style={{
    //       flex: 1,
    //       justifyContent: "center",
    //       alignItems: "center",
    //     }}
    //   >
    //     <View
    //       style={{
    //         // backgroundColor: "red",
    //         height: "20%",
    //         width: "80%",
    //         justifyContent: "space-between",
    //         // alignItems: "center",
    //       }}
    //     >
    //       <TextInput
    //         value={displayName}
    //         placeholder="Enter a display name..."
    //         placeholderTextColor="#bbb"
    //         onChangeText={(text) => setDisplayName(text)}
    //         style={{
    //           borderBottomWidth: 1,
    //           height: 30,
    //           textAlignVertical: "bottom",
    //           fontSize: 20,
    //         }}
    //       />
    //       <SocialIcon
    //         type="google"
    //         title="Sign In With Google"
    //         fontStyle={{ fontSize: 20 }}
    //         button={true}
    //         disabled={!request}
    //         // disabled={!request}
    //         onPress={() => {
    //           promptAsync();
    //         }}
    //         // onPress={() => alert("signing in with google")}
    //         style={
    //           !displayName || !displayNameAvailable
    //             ? styles.disableGoogleBtn
    //             : styles.googleBtn
    //         }
    //       />
    <SocialIcon
      type="google"
      title="Sign In With Google"
      fontStyle={{ fontSize: 20 }}
      button={true}
      disabled={!displayName || !displayNameAvailable ? true : !request}
      // disabled={!request}
      onPress={() => {
        promptAsync();
      }}
      // onPress={() => alert("signing in with google")}
      style={styles.googleBtn}
      // style={
      //   !displayName || !displayNameAvailable
      //     ? styles.disableGoogleBtn
      //     : styles.googleBtn
      // }
    />
    //        {!displayNameAvailable && (
    //         <Text
    //           style={{ color: "#e84118", fontSize: 14, textAlign: "center" }}
    //         >
    //           Display Name Is Not Available
    //         </Text>
    //       )}
    //     </View>
    //   </KeyboardAvoidingView>
    //   <StatusBar style="light" />
    // </Modal>
  );
};

export default GoogleSignInBtn;

const styles = StyleSheet.create({
  googleBtn: {
    width: 200,
    borderRadius: 10,
    alignSelf: "center",
  },
  disableGoogleBtn: {
    width: 200,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#ececec",
  },
});
