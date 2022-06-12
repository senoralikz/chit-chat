import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useToast } from "react-native-toast-notifications";

const ChangePasswordScreen = () => {
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
      const cred = EmailAuthProvider.credential(user.email, currentPassword);

      reauthenticateWithCredential(user, cred)
        .then(() => {
          if (newPassword === confirmNewPassword) {
            updatePassword(user, newPassword)
              .then(() => {
                toast.show("Successfully updated password", {
                  type: "success",
                });
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
    <View style={styles.container}>
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text>Current Password:</Text>
        <TextInput
          value={currentPassword}
          placeholder="Current Password..."
          onChangeText={(text) => setCurrentPassword(text)}
          style={{ borderBottomWidth: 1, width: "50%" }}
          secureTextEntry
        />
      </View>
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text>New Password:</Text>
        <TextInput
          value={newPassword}
          placeholder="New Password..."
          onChangeText={(text) => setNewPassword(text)}
          style={{ borderBottomWidth: 1, width: "50%" }}
          secureTextEntry
        />
      </View>
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text>Confirm New Password:</Text>
        <TextInput
          value={confirmNewPassword}
          placeholder="Current Password..."
          onChangeText={(text) => setConfirmNewPassword(text)}
          style={{ borderBottomWidth: 1, width: "50%" }}
          secureTextEntry
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Pressable
          onPress={handleChangePassword}
          // style={
          //   email === user.email || displayName === user.displayName
          //     ? styles.disabledSignUpBtn
          //     : styles.signUpBtn
          // }
          // disabled={
          //   email === user.email || displayName === user.displayName
          //     ? true
          //     : false
          // }
          // style={
          //   !displayNameAvailable || !emailAvailable
          //     ? styles.disabledSignUpBtn
          //     : styles.signUpBtn
          // }
          // disabled={!emailAvailable || !displayNameAvailable ? true : false}
        >
          <Text style={{ margin: 10, fontSize: 24, color: "#34495e" }}>
            Change Password
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
