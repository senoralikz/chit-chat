import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../firebaseConfig";

const Message = ({ message }) => {
  const user = auth.currentUser;

  return (
    <View
      style={
        user.uid === message.userId
          ? { alignItems: "flex-end" }
          : { alignItems: "flex-start" }
      }
    >
      <Text>{message.message}</Text>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
