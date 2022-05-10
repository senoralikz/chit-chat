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

const HomeScreen = () => {
  const user = auth.currentUser;
  const handleSignOut = () => {
    signOut(auth).then(() => console.log("user signed out from home screen "));
  };

  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>
      <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
      <Text>{user.email}</Text>
      <Text>{user.displayName}</Text>
      {/* <Button title="Sign Out" onPress={() => alert("signing out")} /> */}
      <Button title="Sign Out" onPress={handleSignOut} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  profilePic: {
    borderRadius: 100,
    height: 150,
    width: 150,
  },
});
