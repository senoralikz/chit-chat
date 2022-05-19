import { StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, collection, query, onSnapshot } from "firebase/firestore";
import { Avatar, ListItem } from "react-native-elements";
import { checkActionCode } from "firebase/auth";

const ChatListItem = ({ chat, navigation }) => {
  const [chatters, setChatters] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatRef = doc(userRef, "chats", chat.chatId);
  const q = query(chatRef);

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

  return (
    <Pressable
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
    >
      <ListItem bottomDivider>
        <Avatar source={{ uri: chat.chatters[0].photoURL }} />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "bold" }}>
            {chat.chatters[0].displayName}
          </ListItem.Title>
          <ListItem.Subtitle>This is a test</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Pressable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
