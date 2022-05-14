import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const SettingsScreen = () => {
  const user = auth.currentUser;
  const handleSignOut = () => {
    signOut(auth);
  };
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Settings</Text>
      </View>
      <View style={styles.settingsBodyView}>
        <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
        <Text>{user.email}</Text>
        <Text>{user.displayName}</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
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
});
