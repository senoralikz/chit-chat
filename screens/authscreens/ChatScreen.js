import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
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
  orderBy,
} from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, db } from "../../firebaseConfig";
import { FontAwesome } from "@expo/vector-icons";
import Message from "../../components/Message";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = doc(userRef, "chats", route.params.chatId);
  const messagesRef = collection(chatsRef, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  useEffect(() => {
    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            messageId: doc.id,
          };
        })
      );
    });

    // const unsubMessages = onSnapshot(q, (snapshot) => {
    //   setMessages(
    //     snapshot.docs.map((doc) => {
    //       return {
    //         text: doc.data().text,
    //         _id: doc.data()._id,
    //         createdAt: doc.data().createdAt,
    //         user: {
    //           _id: doc.data()._id,
    //           name: doc.data().name,
    //           avatar: doc.data().avatar,
    //         },
    //       };
    //     })
    //   );
    // });

    return unsubMessages;
  }, []);

  const handleSendMessage = async () => {
    try {
      await addDoc(messagesRef, {
        message: textInput,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userDisplayName: user.displayName,
        userPhotoURL: user.photoURL,
      });
      // route.params.chatters.forEach
      console.log("the chatters are", route.params.chatters);
      setTextInput("");
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
    }
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    addDoc(messagesRef, { _id, createdAt, text, user });
  }, []);

  return (
    // <GiftedChat
    //   messages={messages}
    //   showAvatarForEveryMessage={true}
    //   onSend={(messages) => onSend(messages)}
    //   user={{
    //     _id: auth?.currentUser?.uid,
    //     name: auth?.currentUser?.displayName,
    //     avatar: auth?.currentUser?.photoURL,
    //   }}
    //   alwaysShowSend={true}
    // />

    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          keyExtractor={(item) => item.messageId}
        />
        {/* <ScrollView>
          {messages.map((message) => (
            <View key={message.messageId}>
              <Message message={message} />
            </View>
          ))}
        </ScrollView> */}
        <View style={styles.footer}>
          <TextInput
            placeholder="ChitChat"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
            style={styles.messageInput}
            multiline={true}
            textAlignVertical="center"
          />
          <Pressable
            onPress={handleSendMessage}
            disabled={!textInput ? true : false}
          >
            <FontAwesome
              name="send"
              size={24}
              color={!textInput ? "#ececec" : "#9b59b6"}
            />
          </Pressable>
        </View>
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