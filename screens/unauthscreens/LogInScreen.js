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
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import GoogleSignInBtn from "../../components/GoogleSignInBtn";
import { useToast } from "react-native-toast-notifications";
import { Button, SocialIcon } from "react-native-elements";
import ForgotPasswordModal from "./ForgotPasswordModal";
import * as LocalAuthentication from "expo-local-authentication";

const LogInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [googleModalVisible, setGoogleModalVisible] = useState(false);
  const [loggingInSpinner, setLoggingInSpinner] = useState(false);
  const [logInDisabled, setLogInDisabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const toast = useToast();

  // Check if hardware supports biometrics
  // useEffect(() => {
  //   (async () => {
  //     const compatible = await LocalAuthentication.hasHardwareAsync();
  //     setIsBiometricSupported(compatible);
  //   })();
  // }, []);

  const handleBiometricAuth = async () => {
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return Alert.alert(
        "Biometric record not found",
        "Please verify your identity with your password",
        "OK",
        () => fallBackToDefaultAuth()
      );
  };

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
      <View
        style={{
          // backgroundColor: "red",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="ios-chatbubbles" size={200} color="#9b59b6" />
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
            style={{ flex: 1, fontSize: 18 }}
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
            style={{ flex: 1, fontSize: 18 }}
            secureTextEntry
          />
          {/* <Pressable
            onPress={() =>
              toast.show(
                isBiometricSupported
                  ? "Your device is compatible with Biometrics"
                  : "Face or Fingerprint scanner is available on this device",
                {
                  type: "success",
                }
              )
            }
          >
            <MaterialCommunityIcons
              name="face-recognition"
              size={24}
              color="#22a6b3"
            />
          </Pressable> */}
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
        {/* <Text>
          {isBiometricSupported
            ? "Your device is compatible with Biometrics"
            : "Face or Fingerprint scanner is available on this device"}
        </Text> */}
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
    // justifyContent: "center",
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
});
