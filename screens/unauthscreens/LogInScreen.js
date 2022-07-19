import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GoogleSignInBtn from "../../components/GoogleSignInBtn";
import { useToast } from "react-native-toast-notifications";
import { Button, SocialIcon } from "react-native-elements";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [loggingInSpinner, setLoggingInSpinner] = useState(false);
  const [logInDisabled, setLogInDisabled] = useState(false);

  const toast = useToast();

  const handleSignIn = () => {
    if (!email || !password) {
      toast.show("Please enter a valid email and password", {
        type: "warning",
        placement: "top",
      });
    } else {
      setLoggingInSpinner(true);
      setLogInDisabled(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // setLoggingInSpinner(false);
          // ...
        })
        .catch((error) => {
          setLoggingInSpinner(false);
          setLogInDisabled(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, "-- error signing in --", errorMessage);
          toast.show(errorMessage, {
            type: "danger",
            placement: "top",
          });
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.userInfoInputView}
      >
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
            style={{ width: "100%", fontSize: 18 }}
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
            style={{ width: "100%", fontSize: 18 }}
            secureTextEntry
          />
        </View>
        <View
          style={{
            // backgroundColor: "purple",
            justifyContent: "flex-start",
            width: "80%",
          }}
        >
          <Text
            style={{ fontWeight: "bold" }}
            onPress={() => setModalVisible(true)}
          >
            Forgot Password?
          </Text>
        </View>
        <ForgotPasswordModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        {/* <View>
          <Pressable onPress={handleSignIn} style={styles.logInBtn}>
            <MaterialCommunityIcons name="login" size={24} color="#fff" />
            <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
              Log In
            </Text>
          </Pressable>
        </View> */}
        <Button
          title="Log In"
          titleStyle={{ fontSize: 24 }}
          onPress={handleSignIn}
          buttonStyle={{ backgroundColor: "#22a6b3" }}
          containerStyle={{ width: 200, marginVertical: 20 }}
          loading={loggingInSpinner}
          disabled={logInDisabled}
          disabledStyle={{ backgroundColor: "#b2bec3" }}
          raised={true}
        />
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
        {/* <View style={{ flexDirection: "row", marginVertical: 25 }}>
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
        </View> */}
        {/* <View>
          <SocialIcon
            type="google"
            title="Sign In With Google"
            fontStyle={{ fontSize: 20 }}
            button={true}
            // disabled={!request}
            onPress={() => {
              setGoogleModalVisible(true);
            }}
            // onPress={() => alert("signing in with google")}
            style={{ width: 200, borderRadius: 10 }}
          />
        </View> */}
        {/* <GoogleSignInBtn
          googleModalVisible={googleModalVisible}
          setGoogleModalVisible={setGoogleModalVisible}
        /> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: 20,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 5,
  },
  screenTitleText: {
    fontSize: 36,
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
