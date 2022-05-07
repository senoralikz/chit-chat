import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Sorry", "Please enter a valid email and password", {
        text: "Ok",
      });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          Alert.alert(errorCode, errorMessage, { text: "Ok" });
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text>LogInScreen</Text>
      <View style={styles.credentialInput}>
        <MaterialCommunityIcons
          name="email"
          size={24}
          color="lightgrey"
          style={{ marginRight: 5 }}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={{ width: "100%" }}
        />
      </View>
      <View style={styles.credentialInput}>
        <MaterialCommunityIcons
          name="onepassword"
          size={24}
          color="lightgrey"
          style={{ marginRight: 5 }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ width: "100%" }}
          secureTextEntry
        />
      </View>
      <Button title="Log In" onPress={handleSignIn} />
      {/* <Button title="Log In" onPress={() => alert("logging in")} /> */}
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
    </KeyboardAvoidingView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  credentialInput: {
    flexDirection: "row",
    // width: 250,
    width: "80%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 3,
  },
});
