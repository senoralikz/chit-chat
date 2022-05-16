import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState("");

  useEffect(() => {
    // getMessages();
  });

  const getMessages = () => {
    setMessages(
      route.params.messages.map((message) => {
        return message.message;
      })
    );
  };

  return (
    <View>
      <Text>Chat Screen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
