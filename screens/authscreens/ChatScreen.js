import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  collection,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import {
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import Message from "../../components/Message";
import { Button } from "react-native-elements";
import Toast from "react-native-toast-message";

const ChatScreen = ({ route, navigation, navigation: { goBack } }) => {
  const [messages, setMessages] = useState(route.params.messages || []);
  const [textInput, setTextInput] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  const scrollViewRef = useRef();

  const user = auth.currentUser;
  const groupsRef = collection(db, "groups");
  const chatsRef = collection(db, "chats");
  const messagesRef = collection(chatsRef, route.params.groupId, "messages");

  const q = query(messagesRef, orderBy("createdAt"));

  useEffect(() => {
    // console.log("checking groupId from chat screen", route.params.groupId);
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

  // useEffect(() => {
  //   readMsgs();
  // }, []);

  const readMsgs = async () => {
    // const qMsgs = query(messagesRef, where('readBy', 'array-contains', {'readMsg': false,'user': user.uid }))
    let readMsg = [];
    messages.forEach((message) => {
      message.readBy.filter((reading) => {
        if (reading.readMsg === false && reading.userId === user.uid) {
          readMsg.push(message);
        }
      });
    });

    console.log("unread msgs:", readMsg);

    readMsg.forEach((unreadMsg) => {
      console.log("reading msg:", unreadMsg.messageId);
      unreadMsg.readBy.forEach(async (reading) => {
        try {
          console.log("reading user ID:", reading.userId);
          if (reading.userId === user.uid) {
            console.log("reading msg id again:", unreadMsg.messageId);
            await updateDoc(messagesRef, unreadMsg.messageId, {
              "reading.readMsg": true,
            });
          }
        } catch (error) {
          console.error(
            error.code,
            "-- trouble setting message to read --",
            code.message
          );
          Toast.show({
            type: "error",
            text1: "Trouble setting message to read",
          });
        }
      });
    });
  };

  useEffect(
    () =>
      navigation.addListener("beforeRemove", async () => {
        if (messages.length > 0) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        await deleteDoc(doc(groupsRef, route.params.groupId));
        console.log("leaving chat screen");
      }),
    [navigation, messages]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.groupName
        ? route.params.groupName
        : route.params.friendDisplayName,
      headerLeft: () => (
        <Pressable onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={32} color="#9b59b6" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const onPressFunction = () => {
    scrollViewRef.current.scrollToEnd({ animating: true });
  };

  // const membersRead = () => {
  //   const msgRead = [];
  //   route.params.groupMembers.forEach((member) => {
  //     if (member !== user.uid) {
  //       msgRead.push({ member, readMsg: false });
  //     }
  //   });
  //   console.log("they read the message", msgRead);
  // };

  const handleSendMessage = async () => {
    try {
      let isMsgRead = [];
      route.params.groupMembers.forEach((member) => {
        if (member !== user.uid) {
          isMsgRead.push({ userId: member, readMsg: false });
        }
      });
      const newMessage = await addDoc(messagesRef, {
        message: textInput,
        senderUserId: user.uid,
        readBy: isMsgRead,
        createdAt: serverTimestamp(),
      })
        .then(async (newMessage) => {
          await updateDoc(doc(messagesRef, newMessage.id), {
            messageId: newMessage.id,
          });
        })
        .then(async () => {
          await updateDoc(doc(groupsRef, route.params.groupId), {
            lastModified: serverTimestamp(),
            lastMessage: {
              message: textInput,
              createdAt: serverTimestamp(),
              sentBy: user.uid,
            },
          });
        });
      setTextInput("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sorry!",
        text2: "Trouble sending the message",
      });
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
                <Message
                  message={message}
                  index={index}
                  messages={messages}
                  route={route}
                />
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
        {/* <Button
          title="read msgs"
          onPress={() => console.log(route.params.groupMembers)}
        /> */}
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
});
