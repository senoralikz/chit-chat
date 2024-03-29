import { StyleSheet, Text, View, Pressable, Alert, Button } from "react-native";
import { useEffect, useState, useContext } from "react";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
  where,
  orderBy,
  updateDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { Avatar, ListItem, Badge } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { UnreadMsgContext } from "../context/UnreadMsgContext";
import { useToast } from "react-native-toast-notifications";
import { useRoute } from "@react-navigation/native";
import { TypingAnimation } from "react-native-typing-animation";

const ChatListItem = ({
  chat,
  chats,
  setChats,
  navigation,
  setModalVisible,
}) => {
  const [messages, setMessages] = useState([]);
  const [unreadMsgs, setUnreadMsgs] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [membersInfo, setMembersInfo] = useState("");
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);

  const user = auth.currentUser;
  const toast = useToast();
  const currentRoute = useRoute();
  // const userRef = doc(db, "users", user.uid);
  const groupRef = doc(db, "groups", chat.groupId);
  const chatRef = doc(db, "chats", chat.groupId);
  // const q = query(chatRef);

  useEffect(() => {
    const membersRef = collection(db, "users");
    const q = query(membersRef, where("userId", "in", chat.members));
    // const memberRef = doc(db, "users", memberID);

    const unsubMembers = onSnapshot(q, (snapshot) => {
      let gettingMemberInfo = [];
      let gettingDisplayNames = [];

      snapshot.docs.forEach((doc) => {
        if (doc.data().userId !== user.uid) {
          gettingMemberInfo.push(doc.data());
          gettingDisplayNames.push(doc.data().displayName);
        }
      });
      setMembersInfo(gettingMemberInfo);
      setMemberNames(gettingDisplayNames);
    });

    return unsubMembers;
  }, []);

  useEffect(() => {
    const chatsRef = collection(db, "chats");
    const messagesRef = collection(chatsRef, chat.groupId, "messages");

    const q = query(messagesRef, orderBy("createdAt"));

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
    if (messages.length > 0) {
      let gettingUnreadMsgs = [];
      messages.map((message) => {
        message.readBy.map((checkRead) => {
          if (checkRead.userId === user.uid && checkRead.readMsg === false) {
            gettingUnreadMsgs.push(message);
          }
        });
      });
      setUnreadMsgs(gettingUnreadMsgs.length);
    }
  }, [messages]);

  const deleteMessagesColl = async () => {
    try {
      const messagesRef = collection(chatRef, "messages");
      const snapshot = await getDocs(messagesRef);
      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        messageId: doc.id,
      }));
      results.forEach(async (result) => {
        const docRef = doc(chatRef, "messages", result.messageId);
        await deleteDoc(docRef);
      });
      setTotalUnreadMsgs((prevState) => prevState - unreadMsgs);
    } catch (error) {
      toast.show(error.message, { type: "danger" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const deleteChatDoc = async () => {
    try {
      deleteMessagesColl();
      await deleteDoc(groupRef);
    } catch (error) {
      toast.show(error.message, { type: "danger" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const goToChatScreen = () => {
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 1];
    if (prevRoute.name === "SelectChattersListScreen") {
      setModalVisible(false);
    }
    if (membersInfo.length === 1) {
      navigation.navigate("ChatScreen", {
        messages: messages,
        groupId: chat.groupId,
        groupName: chat.groupName,
        groupMembers: chat.members,
        unreadMsgs: unreadMsgs,
        sentBy: chat.lastMessage.sentBy,
        friendUserId: membersInfo[0]?.userId,
        friendDisplayName: membersInfo[0]?.displayName,
        friendPhotoURL: membersInfo[0]?.photoURL,
        chats: chats,
      });
    } else {
      navigation.navigate("GroupChatScreen", {
        messages: messages,
        groupId: chat.groupId,
        groupPhotoUrl: chat.groupPhotoUrl,
        groupName: chat.groupName,
        groupMembers: chat.members,
        unreadMsgs: unreadMsgs,
        friendDisplayName: memberNames,
        membersInfo: membersInfo,
        chats: chats,
      });
    }
  };

  const rightSwipeActions = () => {
    return (
      <Pressable onPress={deleteChatDoc}>
        <View
          style={{
            backgroundColor: "#eb4d4b",
            height: "100%",
            width: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name="delete" size={28} color="#fff" />
        </View>
      </Pressable>
    );
  };

  return (
    // <Swipeable renderRightActions={rightSwipeActions}>
    <ListItem onPress={goToChatScreen} style={{ height: 70 }}>
      {membersInfo.length === 1 ? (
        <Avatar
          size="medium"
          source={{ uri: membersInfo[0]?.photoURL }}
          rounded
        />
      ) : !chat.groupPhotoUrl ? (
        <View
          style={{
            backgroundColor: "#bdc3c7",
            height: 50,
            width: 50,
            borderRadius: 25,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 42,
              // paddingVertical: 3,
            }}
          >
            {membersInfo.length}
          </Text>
        </View>
      ) : (
        <Avatar size="medium" source={{ uri: chat.groupPhotoUrl }} rounded />
      )}
      <View style={{ position: "absolute", top: 13, left: 52 }}>
        {unreadMsgs > 0 && (
          <Badge
            value={unreadMsgs > 99 ? "99+" : unreadMsgs}
            textStyle={{ fontSize: 14 }}
            badgeStyle={{
              // width: 23,
              height: 23,
              minWidth: 23,
              maxWidth: 35,
              // maxWidth: 35,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              borderColor: "#fff",
              borderWidth: 2,
              backgroundColor: "#9b59b6",
              // position: "absolute",
              // top: 0,
              // left: 52,
            }}
          />
        )}
      </View>
      <ListItem.Content>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListItem.Title
            style={{ fontWeight: "bold", width: "70%" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.groupName ? chat.groupName : memberNames.join(", ")}
          </ListItem.Title>
          <ListItem.Title right={true} style={{ fontSize: 14 }}>
            {new Date(chat.lastMessage?.createdAt * 1000).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            )}
          </ListItem.Title>
          {/* <Button
              title="check chat id"
              onPress={() => console.log("chat id is:", chat.groupId)}
            /> */}
        </View>
        <ListItem.Subtitle
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{ height: 30, marginTop: 5, fontSize: 16 }}
        >
          {chat.memberIsTyping.isTyping &&
          chat.memberIsTyping.memberId !== user.uid ? (
            <View
              style={{
                width: 60,
                height: 30,
                borderRadius: 20,
                borderBottomLeftRadius: 5,
                // marginHorizontal: 8,
                // marginTop: 5,
                justifyContent: "center",
                backgroundColor: "#ecf0f1",
              }}
            >
              <TypingAnimation
                dotColor="#9b59b6"
                dotMargin={8}
                dotAmplitude={3}
                dotSpeed={0.15}
                dotRadius={5}
                dotX={25}
                dotY={-5}
                // style={{ alignSelf: "flex-start" }}
              />
            </View>
          ) : (
            chat.lastMessage?.message
          )}
          {/* {chat.lastMessage?.message} */}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
    // </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
