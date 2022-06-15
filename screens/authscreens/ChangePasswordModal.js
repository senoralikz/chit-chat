import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
} from "react-native";
import { useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useToast } from "react-native-toast-notifications";
import { Ionicons } from "@expo/vector-icons";

const ChangePasswordModal = ({
  passwordModalVisible,
  setPasswordModalVisible,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const user = auth.currentUser;
  const toast = useToast();

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.show("Please enter required information", {
        type: "danger",
      });
    } else {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      reauthenticateWithCredential(user, credential)
        .then(() => {
          if (newPassword === confirmNewPassword) {
            updatePassword(user, newPassword)
              .then(() => {
                toast.show("Successfully updated password", {
                  type: "success",
                });
                setPasswordModalVisible(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
              })
              .catch((error) => {
                toast.show("Error updating password", {
                  type: "danger",
                });
                console.error(
                  error.code,
                  "-- error updating password --",
                  error.message
                );
              });
          } else {
            toast.show("Password confirm does not match new password", {
              type: "danger",
            });
          }
        })
        .catch((error) => {
          toast.show("Current password entered is incorrect", {
            type: "danger",
          });
          console.error(
            error.code,
            "-- current password is incorrect --",
            error.message
          );
        });
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={passwordModalVisible}
      onRequestClose={() => {
        setPasswordModalVisible(false);
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => setPasswordModalVisible(false)}>
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="chevron-back" size={32} color="#22a6b3" />
          </View>
        </Pressable>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>
            Change Password
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontSize: 18 }}>Current Password:</Text>
          </View>
          <TextInput
            value={currentPassword}
            placeholder="Current Password..."
            placeholderTextColor="#bbb"
            onChangeText={(text) => setCurrentPassword(text)}
            style={{
              borderBottomWidth: 1,
              width: "50%",
              height: 30,
              fontSize: 20,
            }}
            secureTextEntry
          />
        </View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontSize: 18 }}>New Password:</Text>
          </View>
          <TextInput
            value={newPassword}
            placeholder="New Password..."
            placeholderTextColor="#bbb"
            onChangeText={(text) => setNewPassword(text)}
            style={{
              borderBottomWidth: 1,
              width: "50%",
              height: 30,
              fontSize: 20,
            }}
            secureTextEntry
          />
        </View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontSize: 18 }}>Confirm New Password:</Text>
          </View>
          <TextInput
            value={confirmNewPassword}
            placeholder="Confirm New Password..."
            placeholderTextColor="#bbb"
            onChangeText={(text) => setConfirmNewPassword(text)}
            style={{
              borderBottomWidth: 1,
              width: "50%",
              height: 30,
              fontSize: 20,
            }}
            secureTextEntry
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Pressable
            onPress={handleChangePassword}
            style={
              newPassword === confirmNewPassword && currentPassword
                ? styles.passwordResetBtn
                : styles.disabledPWResetBtn
            }
            disabled={
              newPassword === confirmNewPassword && currentPassword
                ? false
                : true
            }
          >
            <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
              Change Password
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
