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
    <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
      <Pressable
        onPress={() =>
          navigation.navigate("ChatScreen", { messages: chat.messages })
        }
      >
        <Text>{chatters}</Text>
        {/* <Text>{chat.chatId}</Text> */}
      </Pressable>
    </View>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
