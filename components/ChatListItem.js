import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { Avatar, ListItem, Button, Icon } from "react-native-elements";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

const ChatListItem = ({ chat, navigation }) => {
  const [lastMessage, setLastMessage] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = doc(userRef, "chats", chat.chatId);
  const messagesRef = collection(chatsRef, "messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"));

  useEffect(() => {
    const unsubMessages = onSnapshot(q, (snapshot) => {
      setLastMessage(snapshot.docs.map((doc) => doc.data()));
    });

    return unsubMessages;
  }, []);

  const lastMessageTime =
    lastMessage &&
    new Date(lastMessage[0]?.createdAt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  const deleteMessagesColl = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      const chatRef = doc(userRef, "chats", chat.chatId);
      const messagesRef = collection(chatRef, "messages");
      const q = query(messagesRef);
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        messageId: doc.id,
      }));
      results.forEach(async (result) => {
        const docRef = doc(chatRef, "messages", result.messageId);
        await deleteDoc(docRef);
      });
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const deleteChatDoc = async () => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);
      const chatRef = doc(userRef, "chats", chat.chatId);
      await deleteDoc(chatRef);
      deleteMessagesColl();
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const rightSwipeActions = () => {
    return (
      <Pressable onPress={deleteChatDoc}>
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
      <ListItem
        onPress={() => {
          navigation.navigate("ChatScreen", {
            chatId: chat.chatId,
            friendUserId: chat.friendUserId,
            friendDisplayName: chat.friendDisplayName,
            friendPhotoURL: chat.friendPhotoURL,
            // friends: chat.friends,
          });
        }}
      >
        <Avatar size="medium" source={{ uri: chat.friendPhotoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ListItem.Title style={{ fontWeight: "bold" }}>
              {chat.friendDisplayName}
            </ListItem.Title>
            <ListItem.Title right={true} style={{ fontSize: 14 }}>
              {lastMessageTime}
            </ListItem.Title>
          </View>
          <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail">
            {lastMessage && lastMessage[0]?.message}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
