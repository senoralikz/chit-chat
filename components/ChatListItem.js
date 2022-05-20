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
} from "firebase/firestore";
import { Avatar, ListItem, Button, Icon } from "react-native-elements";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

const ChatListItem = ({ chat, navigation }) => {
  const [chatters, setChatters] = useState("");

  useEffect(() => {
    getChatters();
    // const unsubChat = onSnapshot(q, (querySnapshot) => {
    //   setChatters(
    //     querySnapshot.docs.map((doc) => {
    //       doc.data().chatters.map((chatter) => {
    //         return chatter.displayName;
    //       });
    //     })
    //   );
    // });

    // return unsubChat;
  }, []);

  const getChatters = () => {
    setChatters(
      chat.chatters
        .map((chatter) => {
          return chatter.displayName;
        })
        .join(", ")
    );
  };

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
          // chat.chatters.forEach((chatter) => {
          navigation.navigate("ChatScreen", {
            chatId: chat.chatId,
            // chatterId: chatter.userId,
            // chatterDisplayName: chatter.displayName,
            // chatterPhotoURL: chatter.photoURL,
            chatters: chat.chatters,
          });
          // });
        }}
        // bottomDivider
      >
        <Avatar
          size="medium"
          source={{ uri: chat.chatters[0].photoURL }}
          rounded
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {chat.chatters[0].displayName}
          </ListItem.Title>
          <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail">
            This is a test
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
