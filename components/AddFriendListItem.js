import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebaseConfig";
import { doc, collection, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const AddFriendListItem = ({ user, currentFriends }) => {
  const [alreadyFriends, setAlreadyFriends] = useState(false);

  const friendsCollRef = collection(
    db,
    "users",
    auth.currentUser.uid,
    "friends"
  );

  useEffect(() => {
    checkIfFriends();
  }, [currentFriends]);

  const addFriend = async () => {
    try {
      await setDoc(doc(friendsCollRef, user.userId), {
        photoURL: user.photoURL,
        displayName: user.displayName,
        userId: user.userId,
      });
    } catch (error) {
      console.error(error.code, "-- error adding friend --", error.message);
    }
  };

  const checkIfFriends = () => {
    {
      currentFriends &&
        currentFriends.some((friend) => friend.userId === user.userId) &&
        setAlreadyFriends(true);
    }
  };

  return (
    <ListItem>
      <Avatar source={{ uri: user.photoURL }} rounded size="medium" />
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
            {user.displayName}
          </ListItem.Title>
          <ListItem.Title>
            <Pressable
              onPress={
                () =>
                  Toast.show({
                    type: "success",
                    text1: "Chatting!",
                    text2: `You are chatting with ${user.displayName}`,
                  })
                // navigation.navigate("ChatScreen")
              }
              style={{ paddingRight: 20, paddingTop: 1 }}
            >
              <Ionicons name="chatbubble" size={28} color="#9b59b6" />
            </Pressable>
            <Pressable onPress={addFriend} disabled={alreadyFriends}>
              <Ionicons
                name="add-circle"
                size={30}
                color={alreadyFriends ? "#bdc3c7" : "#22a6b3"}
              />
            </Pressable>
          </ListItem.Title>
        </View>
        <ListItem.Subtitle>
          {alreadyFriends && <Text>Friend</Text>}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default AddFriendListItem;

const styles = StyleSheet.create({});
