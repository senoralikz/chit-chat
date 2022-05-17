import { StyleSheet, Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";

const ChatListItem = ({ chat, navigation }) => {
  const [chatters, setChatters] = useState("");

  useEffect(() => {
    getChatters();
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
        chat.chatters.forEach((chatter) => {
          navigation.navigate("ChatScreen", {
            chatId: chat.chatId,
            chatterId: chatter.userId,
            chatterDisplayName: chatter.displayName,
            chatterPhotoURL: chatter.photoURL,
          });
        });
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
