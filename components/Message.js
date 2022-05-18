import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { auth } from "../firebaseConfig";
import { Avatar } from "react-native-elements";

const Message = ({ message }) => {
  const user = auth.currentUser;
  const formattedTime = new Date(message.createdAt * 1000).toLocaleTimeString(
    "en-US"
  );

  // const formattedTime = message.createdAt.toLocaleString("en-US", {
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: true,
  // });

  return (
    <View
      style={
        user.uid === message.userId
          ? {
              alignSelf: "flex-end",
              paddingHorizontal: 5,
              paddingVertical: 3,
            }
          : {
              alignSelf: "flex-start",
              paddingHorizontal: 5,
              paddingVertical: 3,
            }
      }
    >
      {user.uid === message.userId ? (
        <>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.messagesSent}>
              <View>
                <Text style={{ color: "#fff", fontSize: 16 }}>
                  {message.message}
                </Text>
                <Text
                  style={{ fontSize: 12, color: "#fff", textAlign: "right" }}
                >
                  {formattedTime}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "flex-end",
                marginLeft: 3,
              }}
            >
              <Avatar
                size="small"
                rounded
                source={{ uri: message.userPhotoURL }}
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                justifyContent: "flex-end",
                marginRight: 3,
              }}
            >
              <Avatar
                size="small"
                rounded
                source={{ uri: message.userPhotoURL }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={{ paddingLeft: 10, color: "#95a5a6" }}>
                {message.userDisplayName}
              </Text>
              <View style={styles.messagesReceived}>
                <View>
                  <Text style={{ fontSize: 16 }}>{message.message}</Text>
                  <Text style={{ fontSize: 12 }}>{formattedTime}</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  messagesSent: {
    borderRadius: 20,
    backgroundColor: "#22a6b3",
    padding: 10,
  },
  messagesReceived: {
    borderRadius: 20,
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});
