import { StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, collection, query, onSnapshot } from "firebase/firestore";

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
      style={styles.container}
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
      <View>
        <Text>{chatters}</Text>
        {/* <Text>{chat.chatId}</Text> */}
      </View>
    </Pressable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
  },
});
