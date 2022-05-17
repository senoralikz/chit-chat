import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  addDoc,
  doc,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, db } from "../../firebaseConfig";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = doc(userRef, "chats", route.params.chatId);
  const messagesRef = collection(chatsRef, "messages");
  const q = query(messagesRef);

  useEffect(() => {
    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          return {
            text: doc.data().message,
            _id: doc.id,
            createdAt: doc.data().timestamp,
            user: {
              _id: doc.data().userId,
              name: doc.data().displayName,
              avatar: doc.data().photoURL,
            },
          };
        })
      );
    });
    return unsubMessages;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    addDoc(messagesRef, { _id, createdAt, text, user });
  }, []);

  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  // }, []);

  return (
    // <GiftedChat
    //   messages={messages}
    //   showAvatarForEveryMessage={false}
    //   onSend={(messages) => onSend(messages)}
    //   user={{
    //     _id: auth?.currentUser?.email,
    //     name: auth?.currentUser?.displayName,
    //     avatar: auth?.currentUser?.photoURL,
    //   }}
    //   // isTyping={true}
    //   alwaysShowSend={true}
    // />
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <ScrollView>
          <Text>Hello</Text>
        </ScrollView>
        <>
          <View style={styles.footer}>
            <TextInput
              placeholder="Type a Message"
              style={styles.messageInput}
            />
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  messageInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ececec",
    borderWidth: 1,
    padding: 10,
    // color: "grey",
    borderRadius: 30,
  },
});
