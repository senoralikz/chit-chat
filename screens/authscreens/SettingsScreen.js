import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Pressable,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const SettingsScreen = () => {
  const [pickedPhoto, setPickedPhoto] = useState("");
  const user = auth.currentUser;
  const handleSignOut = () => {
    signOut(auth);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Settings</Text>
      </View>
      <View style={styles.settingsBodyView}>
        <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
        <Text>{user.email}</Text>
        <Text>{user.displayName}</Text>
        <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
          <Text style={{ margin: 10, fontSize: 24, color: "#fff" }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 5,
  },
  settingsBodyView: {
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    borderRadius: 100,
    height: 150,
    width: 150,
  },
  signOutBtn: {
    backgroundColor: "#22a6b3",
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
