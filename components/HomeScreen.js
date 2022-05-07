import { StyleSheet, Text, View, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const HomeScreen = () => {
  const user = auth.currentUser;
  const handleSignOut = () => {
    signOut(auth).then(() => console.log("user signed out from home screen "));
  };

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>{user.email}</Text>
      {/* <Button title="Sign Out" onPress={() => alert("signing out")} /> */}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
