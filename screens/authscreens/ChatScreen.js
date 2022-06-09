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
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { UnreadMsgContext } from "../../context/UnreadMsgContext";
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
  arrayRemove,
  arrayUnion,
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
import { useToast } from "react-native-toast-notifications";
import { useRoute } from "@react-navigation/native";
import { Badge } from "react-native-elements";

const ChatScreen = ({ route, navigation, navigation: { goBack } }) => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState([]);
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);
  const scrollViewRef = useRef();

  const toast = useToast();

  const currentRoute = useRoute();
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

  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const messagesRef = collection(chatsRef, route.params.groupId, "messages");

    const q = query(
      messagesRef,
      where("readBy", "array-contains", { readMsg: false, userId: user.uid })
    );
    // console.log("checking groupId from chat screen", route.params.groupId);
    const unsubUnreadMsgs = onSnapshot(q, (snapshot) => {
      setUnreadMsgs(
        snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            messageId: doc.id,
          };
        })
      );
    });

    return unsubUnreadMsgs;
  }, []);

  useEffect(() => {
    readMsgs();
  }, [unreadMsgs]);

  // useEffect(() => {
  //   const messagesRef = collection(db, "groups");
  //   const q = query(messagesRef, where("members", "array-contains", user.uid));

  //   const unsubNewMsgs = onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.docs.forEach((doc) => {
  //       console.log("the group info:", doc.data());
  //       if (currentRoute.name === "ChatScreen") {
  //         if (doc.data().groupId !== route.params.groupId) {
  //           if (
  //             doc.data().lastMessage &&
  //             doc.data().lastMessage?.sentBy !== user.uid
  //           ) {
  //             toast.show(doc.data().lastMessage?.message, {
  //               type: "newMessage",
  //               message: doc.data().lastMessage?.message,
  //               displayName: doc.data().lastMessage?.senderDisplayName,
  //               photoURL: doc.data().lastMessage?.senderPhotoURL,
  //               placement: "top",
  //               duration: 5000,
  //             });
  //           }
  //         }
  //       }
  //     });
  //   });
  //   return unsubNewMsgs;
  // }, []);

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
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="chevron-back" size={32} color="#9b59b6" />
            <View style={{ justifyContent: "center" }}>
              {totalUnreadMsgs > 0 && (
                <Badge
                  value={totalUnreadMsgs > 99 ? "99+" : totalUnreadMsgs}
                  textStyle={{ fontSize: 16 }}
                  badgeStyle={{
                    height: 23,
                    minWidth: 23,
                    maxWidth: 35,
                    borderRadius: 15,
                    backgroundColor: "#9b59b6",
                  }}
                />
              )}
            </View>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, totalUnreadMsgs]);

  const onPressFunction = () => {
    scrollViewRef.current.scrollToEnd({ animating: true });
  };

  const readMsgs = () => {
    try {
      unreadMsgs.forEach((unreadMsg) => {
        unreadMsg.readBy.map((userRead) => {
          if (userRead.userId === user.uid) {
            userRead.readMsg = true;
          }
        });
      });
      unreadMsgs.forEach(async (unreadMsg) => {
        const unReadMsgRef = doc(
          db,
          "chats",
          route.params.groupId,
          "messages",
          unreadMsg.messageId
        );
        await updateDoc(unReadMsgRef, {
          readBy: unreadMsg.readBy,
        });
      });
      setTotalUnreadMsgs((prevState) => prevState - unreadMsgs.length);
    } catch (error) {
      toast.show("Trouble updating messages to read", {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error updating messages to read --",
        error.message
      );
    }
  };

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
              senderDisplayName: user.displayName,
              senderPhotoURL: user.photoURL,
            },
          });
        });
      setTextInput("");
    } catch (error) {
      toast.show("Trouble sending the message", {
        type: "danger",
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
          {messages?.length !== 0 ? (
            messages?.map((message, index) => (
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
          onPress={() => console.log(route.params.unreadMsgs)}
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
