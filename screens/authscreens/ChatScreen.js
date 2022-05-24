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
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  addDoc,
  setDoc,
  doc,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import {
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import Message from "../../components/Message";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState("");
  const [textInput, setTextInput] = useState("");
  const scrollViewRef = useRef();

  const user = auth.currentUser;
  const groupsRef = collection(db, "groups");
  const chatsRef = collection(db, "chats");
  const messagesRef = collection(chatsRef, route.params.groupId, "messages");

  const q = query(messagesRef, orderBy("createdAt"));

  // useEffect(() => {
  //   const unsubGroups = onSnapshot(qGroups, (snapshot) => {
  //     setGroups(
  //       snapshot.docs.map((doc) => {
  //         return {
  //           ...doc.data(),
  //           groupId: doc.id,
  //         };
  //       })
  //     );
  //   });

  //   return unsubGroups;
  // }, []);

  useEffect(() => {
    console.log("checking groupId from chat screen", route.params.groupId);
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

  const onPressFunction = () => {
    scrollViewRef.current.scrollToEnd({ animating: true });
  };

  const handleSendMessage = async () => {
    try {
      await addDoc(messagesRef, {
        message: textInput,
        senderDisplayName: user.displayName,
        senderPhotoURL: user.photoURL,
        senderUserId: user.uid,
        createdAt: serverTimestamp(),
      });
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
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {messages.length !== 0 ? (
            messages.map((message, index) => (
              <View key={message.messageId}>
                <Message message={message} index={index} messages={messages} />
              </View>
            ))
          ) : (
            <View style={{ marginTop: 80, alignItems: "center" }}>
              <MaterialCommunityIcons
                name="message-off"
                size={60}
                color="#bdc3c7"
              />
              <Text style={{ fontSize: 18, color: "#bdc3c7" }}>
                No Messages
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TextInput
            placeholder="ChitChat"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
            style={styles.messageInput}
            multiline={true}
            textAlignVertical="center"
            onPressIn={onPressFunction}
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
    backgroundColor: "#ececec",
    padding: 10,
    borderRadius: 30,
  },
  // button: {
  //   position: "absolute",
  //   width: 50,
  //   height: 50,
  //   borderRadius: 50 / 2,
  //   backgroundColor: "pink",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   right: 30,
  //   bottom: 30,
  // },
});
