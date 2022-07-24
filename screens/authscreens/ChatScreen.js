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
  Ionicons,
} from "@expo/vector-icons";
import Message from "../../components/Message";
import { Avatar, Button } from "react-native-elements";
import { useToast } from "react-native-toast-notifications";
import { useRoute } from "@react-navigation/native";
import { Badge } from "react-native-elements";
import { TypingAnimation } from "react-native-typing-animation";
import FadeInOut from "react-native-fade-in-out";
// import { newMessageAlert } from "../../helperFunctions/newMessageAlert";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState(route.params.messages);
  const [textInput, setTextInput] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState([]);
  const [memberIsTyping, setMemberIsTyping] = useState(false);
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);
  const scrollViewRef = useRef();

  const toast = useToast();

  const currentRoute = useRoute();
  const user = auth.currentUser;
  const groupRef = doc(db, "groups", route.params.groupId);
  const groupsRef = collection(db, "groups");
  const chatsRef = collection(db, "chats");
  const messagesRef = collection(chatsRef, route.params.groupId, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        route.params.groupName ? (
          <Text>{route.params.groupName}</Text>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Avatar
              source={{ uri: route.params.friendPhotoURL }}
              size="small"
              rounded
            />
            <Text
              style={{
                alignSelf: "center",
                marginLeft: 5,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {route.params.friendDisplayName}
            </Text>
          </View>
        ),
      headerLeft: () => (
        <Pressable onPress={() => navigation.navigate("ChatsListScreen")}>
          {/* <Pressable onPress={() => goBack()}> */}
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
                    marginRight: 15,
                  }}
                />
              )}
            </View>
          </View>
        </Pressable>
      ),
    });
  }, [navigation, totalUnreadMsgs]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", async () => {
        if (messages?.length > 0) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        await deleteDoc(doc(groupsRef, route.params.groupId));
      }),
    [navigation, messages]
  );

  useEffect(() => {
    checkIfTyping();
  }, [textInput]);

  useEffect(() => {
    const unsubMemberIsTyping = onSnapshot(groupRef, (doc) => {
      // console.log(doc.data().memberIsTyping.isTyping);
      if (doc.data().memberIsTyping.memberId !== user.uid) {
        setMemberIsTyping(doc.data().memberIsTyping.isTyping);
      }
    });

    return unsubMemberIsTyping;
  }, []);

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
  //   newMessageAlert(chats, user, route.params?.groupId, currentRoute, toast);
  // }, [chats]);

  // useEffect(() => {
  //   if (chats.length > 0) {
  //     if (
  //       chats[0].groupId !== route.params.groupId &&
  //       chats[0].lastMessage?.sentBy !== user.uid
  //     ) {
  //       toast.show(chats[0].lastMessage?.message, {
  //         type: "newMessage",
  //         message: chats[0].lastMessage?.message,
  //         displayName: chats[0].lastMessage?.senderDisplayName,
  //         photoURL: chats[0].lastMessage?.senderPhotoURL,
  //         createdAt: new Date(
  //           chats[0].lastMessage?.createdAt * 1000
  //         ).toLocaleTimeString("en-US", {
  //           hour: "numeric",
  //           minute: "numeric",
  //           hour12: true,
  //         }),
  //         placement: "top",
  //         duration: 5000,
  //       });
  //     }
  //   }
  // }, [chats]);

  // useEffect(() => {
  //   if (currentRoute.name !== "ChatScreen") {
  //     if (chats.length > 0 && chats[0].groupId !== route.params.groupId) {
  //       if (chats[0].lastMessage && chats[0].lastMessage?.sentBy !== user.uid) {
  //         toast.show(chats[0].lastMessage?.message, {
  //           type: "newMessage",
  //           message: chats[0].lastMessage?.message,
  //           displayName: chats[0].lastMessage?.senderDisplayName,
  //           photoURL: chats[0].lastMessage?.senderPhotoURL,
  //           placement: "top",
  //           duration: 5000,
  //         });
  //       }
  //     }
  //   }
  // }, [chats]);

  useEffect(() => {
    if (messages?.length > 0) {
      let gettingUnreadMsgs = [];
      messages.map((message) => {
        message.readBy.map((checkRead) => {
          if (checkRead.userId === user.uid && checkRead.readMsg === false) {
            gettingUnreadMsgs.push(message);
          }
        });
      });
      setUnreadMsgs(gettingUnreadMsgs);
    }
  }, [messages]);

  useEffect(() => {
    setTotalUnreadMsgs((prevState) => prevState - route.params.unreadMsgs);
  }, []);

  useEffect(() => {
    readMsgs();
  }, [unreadMsgs]);

  const onPressFunction = () => {
    scrollViewRef.current.scrollToEnd({ animating: true });
  };

  const checkIfTyping = async () => {
    try {
      if (textInput) {
        await updateDoc(groupRef, {
          memberIsTyping: { memberId: user.uid, isTyping: true },
        });
      } else {
        await updateDoc(groupRef, {
          memberIsTyping: { memberId: user.uid, isTyping: false },
        });
      }
    } catch (error) {
      toast.show(error.message, {
        type: "danger",
      });
      console.error(
        error.code,
        "-- error checking if member is typing --",
        error.message
      );
    }
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
          // contentContainerStyle={{
          //   backgroundColor: "blue",
          //   justifyContent: "space-between",
          // }}
        >
          {messages?.length > 0 ? (
            messages?.map((message, index) => (
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
          <FadeInOut visible={memberIsTyping}>
            {memberIsTyping && (
              <View
                style={{
                  width: 60,
                  height: 40,
                  borderRadius: 20,
                  borderBottomLeftRadius: 5,
                  marginHorizontal: 8,
                  marginTop: 5,
                  justifyContent: "center",
                  backgroundColor: "#ecf0f1",
                }}
              >
                <TypingAnimation
                  dotColor="#9b59b6"
                  dotMargin={10}
                  dotAmplitude={3}
                  dotSpeed={0.15}
                  dotRadius={5}
                  dotX={25}
                  dotY={-5}
                  // style={{ alignSelf: "flex-start" }}
                />
              </View>
            )}
          </FadeInOut>
        </ScrollView>
        {/* <Button
          title="check typing"
          onPress={() => console.log("someone is typing:", memberIsTyping)}
        />
        <Button
          title="check group id"
          onPress={() => console.log("group id:", route.params.groupId)}
        /> */}
        {/* {userIsTyping && (
          <>
            <View style={{ height: 10 }} />
            <View style={{ flexDirection: "row" }}>
              <Avatar
                source={{ uri: user.photoURL }}
                size={30}
                rounded
                containerStyle={{ marginHorizontal: 8, alignSelf: "flex-end" }}
              />
              <View
                style={{
                  width: 65,
                  height: 40,
                  borderRadius: 20,
                  borderBottomLeftRadius: 5,
                  // padding: 10,
                  justifyContent: "center",
                  backgroundColor: "#ecf0f1",
                }}
              >
                <TypingAnimation
                  dotColor="#9b59b6"
                  dotMargin={10}
                  dotAmplitude={3}
                  dotSpeed={0.15}
                  dotRadius={6}
                  dotX={25}
                  dotY={-5}
                  // style={{ alignSelf: "flex-start" }}
                />
              </View>
            </View>
          </>
        )} */}
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
