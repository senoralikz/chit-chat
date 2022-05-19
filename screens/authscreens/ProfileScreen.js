import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Avatar } from "react-native-elements";

const ProfileScreen = () => {
  const user = auth.currentUser;

  const [pickedPhoto, setPickedPhoto] = useState("");
  const [email, setEmail] = useState(user.email);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [emailVerified, setEmailVerified] = useState("");

  const handleSignOut = () => {
    signOut(auth);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Profile</Text>
      </View>
      <View style={styles.settingsBodyView}>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <Avatar source={{ uri: user.photoURL }} size={150} rounded />
        </View>
        <View style={{ marginVertical: 20 }}>
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Email: </Text>
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              style={styles.credentialInput}
            />
          </View>
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Display Name: </Text>
            <TextInput
              value={displayName}
              placeholder="Display Name"
              onChangeText={(text) => setDisplayName(text)}
              style={styles.credentialInput}
            />
          </View>
          <View style={styles.credentialInputView}>
            <Text style={styles.credentialPropertyText}>Email Verified: </Text>
            {user.emailVerified ? (
              <Text style={styles.credentialPropertyText}>Yes</Text>
            ) : (
              <Text style={styles.credentialPropertyText}>No</Text>
            )}
          </View>
          <View style={{ alignItems: "center" }}>
            <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
              <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
                Sign Out
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 5,
  },
  settingsBodyView: {
    // justifyContent: "center",
    // alignItems: "center",
  },
  credentialInputView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  credentialPropertyText: {
    fontSize: 18,
  },
  credentialInput: {
    width: "60%",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    fontSize: 18,
  },
  signOutBtn: {
    backgroundColor: "#22a6b3",
    borderRadius: 10,
    width: 200,
    marginVertical: 20,
    alignItems: "center",
    // justifyContent: "center",
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#333",
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
