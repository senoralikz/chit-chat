import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  SafeAreaView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ChatsScreen = () => {
  const user = auth.currentUser;
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <SafeAreaView>
      <Text>ChatsScreen</Text>
      <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
      <Text>{user.email}</Text>
      <Text>{user.displayName}</Text>
      {/* <Button title="Sign Out" onPress={() => alert("signing out")} /> */}
      <Button title="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  profilePic: {
    borderRadius: 100,
    height: 150,
    width: 150,
  },
});
