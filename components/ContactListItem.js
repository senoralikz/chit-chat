import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { auth, db } from "../firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";

const ContactListItem = ({ friend, navigation }) => {
  const deleteFriend = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      const friendRef = doc(userRef, "friends", friend.friendDocId);
      await deleteDoc(friendRef);
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting friend --", error.message);
    }
  };

  const rightSwipeActions = () => {
    return (
      <Pressable onPress={deleteFriend}>
        <View
          style={{
            backgroundColor: "#eb4d4b",
            height: "100%",
            width: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="delete" size={28} color="#fff" />
        </View>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={rightSwipeActions}>
      <ListItem>
        <Avatar size="medium" source={{ uri: friend.photoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItem.Title
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {friend.displayName}
            </ListItem.Title>
            <ListItem.Title>
              <Pressable
                onPress={
                  () =>
                    Alert.alert(
                      "El Bochinche",
                      `You are gossiping with ${friend.displayName}`,
                      { text: "Ok" }
                    )
                  // navigation.navigate("ChatScreen")
                }
              >
                <Ionicons name="chatbubble" size={24} color="#9b59b6" />
              </Pressable>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({});
