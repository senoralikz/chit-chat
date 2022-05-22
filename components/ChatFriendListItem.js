import { StyleSheet, Text, View, Alert } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { auth, db } from "../firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";

const ChatFriendListItem = ({ friend, navigation }) => {
  const handleCreateChat = async () => {
    alert(`chatting with ${friend.friendDisplayName}`);
    // try {
    //   const user = auth.currentUser;
    //   const userRef = doc(db, "users", user.uid);
    //   const chatRef = collection(userRef, "chats");
    //   // const chatRef = await addDoc(collection(userRef, "chats"), {
    //   //   friendPhotoURL: friend.friendPhotoURL,
    //   //   friendDisplayName: friend.friendDisplayName,
    //   //   friendUserId: friend.friendUserId,
    //   // });
    //   const chatId = await addDoc(chatRef, {
    //     friendPhotoURL: friend.friendPhotoURL,
    //     friendDisplayName: friend.friendDisplayName,
    //     friendUserId: friend.friendUserId,
    //   });
    //   navigation.navigate("ChatScreen", {
    //     friendPhotoURL: friend.friendPhotoURL,
    //     friendDisplayName: friend.friendDisplayName,
    //     friendUserId: friend.friendUserId,
    //     chatId: chatId.id,
    //   });
    // } catch (error) {
    //   Alert.alert(error.code, error.message, { text: "Ok" });
    //   console.error(
    //     error.code,
    //     "-- error creating chat room --",
    //     error.message
    //   );
    // }
  };

  // const createChat = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     const userRef = doc(db, "users", user.uid);
  //     const chatRef = collection(userRef, 'chats')
  //     await addDoc(chatRef, {
  //       friendPhotoURL: friend.friendPhotoURL,
  //       friendDisplayName: friend.friendDisplayName,
  //       friendUserId: friend.friendUserId,
  //     })
  //   }
  // }

  return (
    <ListItem onPress={handleCreateChat}>
      <Avatar size="medium" source={{ uri: friend.friendPhotoURL }} rounded />
      <ListItem.Content>
        <ListItem.Title>{friend.friendDisplayName}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatFriendListItem;

const styles = StyleSheet.create({});
