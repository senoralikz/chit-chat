import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { Avatar } from "react-native-elements";
import { getDoc, doc } from "firebase/firestore";

const Message = ({ message, index, messages }) => {
  const [senderInfo, setSenderInfo] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    fetchSenderInfo();
  }, []);

  const fetchSenderInfo = async () => {
    const userRef = doc(db, "users", message.senderUserId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setSenderInfo(docSnap.data());
    }
  };

  const formattedTime = new Date(message.createdAt * 1000).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  const newMsgDate = new Date(
    message.createdAt?.seconds * 1000 + message.createdAt?.nanoseconds / 1000000
  ).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const prevMsgDate = new Date(
    messages[index - 1]?.createdAt.seconds * 1000 +
      messages[index - 1]?.createdAt.nanoseconds / 1000000
  ).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {newMsgDate !== prevMsgDate && (
        <Text
          style={{ textAlign: "center", color: "#7f8c8d", paddingVertical: 10 }}
        >
          {newMsgDate}
        </Text>
      )}
      <View
        style={
          user.uid === message.senderUserId
            ? {
                alignSelf: "flex-end",
                paddingHorizontal: 8,
                paddingVertical: 3,
              }
            : {
                alignSelf: "flex-start",
                paddingHorizontal: 8,
                paddingVertical: 3,
              }
        }
      >
        {user.uid === message.senderUserId ? (
          <View style={{ flexDirection: "row" }}>
            <View style={styles.messagesSent}>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {message.message}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                  textAlign: "right",
                  paddingTop: 5,
                }}
              >
                {formattedTime}
              </Text>
            </View>
            {/* <View
              style={{
                justifyContent: "flex-end",
                marginLeft: 3,
              }}
            >
              <Avatar size="small" rounded source={{ uri: user.photoURL }} />
            </View> */}
          </View>
        ) : (
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
                source={{ uri: senderInfo.photoURL }}
              />
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ paddingLeft: 10, color: "#95a5a6" }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {senderInfo.displayName}
              </Text>
              <View style={styles.messagesReceived}>
                <Text style={{ fontSize: 16 }}>{message.message}</Text>
                <Text style={{ fontSize: 12, paddingTop: 5 }}>
                  {formattedTime}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default Message;

const styles = StyleSheet.create({
  messagesSent: {
    maxWidth: 250,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    padding: 10,
    backgroundColor: "#9b59b6",
  },
  messagesReceived: {
    maxWidth: 250,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    padding: 10,
    backgroundColor: "#ecf0f1",
  },
});
