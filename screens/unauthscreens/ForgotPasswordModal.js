import { useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const ForgotPasswordModal = ({
  modalVisible,
  setModalVisible,
  // handleResetPassword,
}) => {
  const [email, setEmail] = useState("");

  const toast = useToast();

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setModalVisible(false);
        setEmail("");
        toast.show("Sent Password Reset Email", {
          type: "success",
          placement: "top",
        });
      })
      .catch((error) => {
        toast.show("Error sending password reset email", {
          type: "danger",
          placement: "top",
        });
        console.error(
          error.code,
          "-- error sending password reset email --",
          error.message
        );
      });
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => setModalVisible(false)}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="chevron-back" size={32} color="#22a6b3" />
          </View>
        </Pressable>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>
            Forgot Password
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            // backgroundColor: "red",
            width: "80%",
            height: "80%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>
            Enter your email below and press the 'Reset Email' button. You will
            receive and email with instructions on how to reset your password.
          </Text>
          {/* <Text>Email:</Text> */}
          <View
            style={{
              // backgroundColor: "green",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={10}
            >
              <TextInput
                value={email}
                placeholder="Email..."
                onChangeText={(text) => setEmail(text)}
                style={{
                  // backgroundColor: "orange",
                  borderBottomWidth: 1,
                  height: 30,
                  textAlignVertical: "bottom",
                  fontSize: 20,
                }}
              />
              <View style={{ alignItems: "center" }}>
                <Pressable
                  onPress={handleResetPassword}
                  style={
                    email ? styles.passwordResetBtn : styles.disabledPWResetBtn
                  }
                  disabled={email ? false : true}
                >
                  <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
                    Reset Email
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  passwordResetBtn: {
    backgroundColor: "#34495e",
    borderRadius: 10,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  disabledPWResetBtn: {
    backgroundColor: "#bdc3c7",
    borderRadius: 10,
    borderColor: "#34495e",
    borderWidth: 1,
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
