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
import { useState, useEffect } from "react";
import {
  addDoc,
  doc,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Message from "../../components/Message";

const ChatScreen = ({ route }) => {
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
      console.error(error.code, "-- error sending message --", error.message);
    }
  };

  return (
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
          ListEmptyComponent={() => (
            <View style={{ marginTop: 80, alignItems: "center" }}>
              <MaterialCommunityIcons
                name="message-off"
                size={60}
                color="#bdc3c7"
              />
            </View>
          )}
        />
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
