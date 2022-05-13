import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from "react-native";
import { useState, useLayoutEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SocialIcon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignInBtn from "../components/GoogleSignInBtn";

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Hello",
    });
  }, [navigation]);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View>
          <Text style={styles.screenTitleText}>ChitChat</Text>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            alignSelf: "center",
          }}
        >
          Log In
        </Text>
      </View>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.userInfoInputView}
      >
        {/* <View style={{ marginBottom: 20 }}>
          <SocialIcon
            type="apple"
            title="Sign In With Apple"
            fontStyle={{ fontSize: 20 }}
            button={true}
            onPress={() => alert("signing in with apple")}
            style={{
              width: 200,
              backgroundColor: "#000",
              borderRadius: 10,
            }}
          />
          
        </View> */}
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
        <View>
          <Pressable onPress={handleSignIn} style={styles.logInBtn}>
            <MaterialCommunityIcons name="login" size={24} color="#fff" />
            <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
              Log In
            </Text>
          </Pressable>
        </View>
        <Text style={{ fontSize: 16 }}>
          Don't have an account? You can
          <Text
            style={{ color: "#3498db", fontWeight: "bold" }}
            onPress={() => navigation.navigate("SignUp")}
          >
            {" "}
            sign up{" "}
          </Text>
          here!
        </Text>
        <View style={{ flexDirection: "row", marginVertical: 25 }}>
          <View
            style={{
              backgroundColor: "lightgrey",
              height: 2,
              flex: 1,
              alignSelf: "center",
            }}
          />
          <Text style={{ alignSelf: "center", paddingHorizontal: 5 }}>Or</Text>
          <View
            style={{
              backgroundColor: "lightgrey",
              height: 2,
              flex: 1,
              alignSelf: "center",
            }}
          />
        </View>
        <View>
          <GoogleSignInBtn />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 5,
  },
  screenTitleText: {
    fontSize: 32,
    fontWeight: "800",
  },
  userInfoInputView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  credentialInput: {
    flexDirection: "row",
    width: "80%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 3,
  },
  logInBtn: {
    flexDirection: "row",
    backgroundColor: "#34495e",
    borderRadius: 10,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
