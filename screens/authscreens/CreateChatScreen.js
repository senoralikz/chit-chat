import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import Message from "../../components/Message";
import { auth, db } from "../../firebaseConfig";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

const CreateChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = doc(userRef, "chats", route.params.chatId);
  const chatsCollRef = doc(userRef, "chats");
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

  const addChatters = async () => {};

  const handleSendMessage = async () => {
    // alert("sending message from create chat screen");
    try {
      await addDoc(doc(messagesRef), {
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

export default CreateChatScreen;

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
