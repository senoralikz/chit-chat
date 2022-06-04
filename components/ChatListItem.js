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
} from "firebase/firestore";
import { Avatar, ListItem, Icon, Badge } from "react-native-elements";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { UnreadMsgContext } from "../context/UnreadMsgContext";

const ChatListItem = ({ chat, navigation }) => {
  const [unreadMsgs, setUnreadMsgs] = useState([]);
  const [memberNames, setMemberNames] = useState([]);
  const [membersInfo, setMembersInfo] = useState("");
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);

  const user = auth.currentUser;
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
    setTotalUnreadMsgs((prevState) => prevState + unreadMsgs.length);
  }, [unreadMsgs]);

  const deleteMessagesColl = async () => {
    try {
      const q = query(chatRef, "messages");
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        ...doc.data(),
        messageId: doc.id,
      }));
      results.forEach(async (result) => {
        const docRef = doc(chatRef, "messages", result.messageId);
        await deleteDoc(docRef);
      });
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const deleteChatDoc = async () => {
    try {
      deleteMessagesColl();
      await deleteDoc(groupRef);
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting chat --", error.message);
    }
  };

  const goToChatScreen = () => {
    if (membersInfo.length === 1) {
      navigation.navigate("ChatScreen", {
        // messages: messages,
        groupId: chat.groupId,
        groupName: chat.groupName,
        groupMembers: chat.members,
        unreadMsgs: unreadMsgs,
        sentBy: chat.lastMessage.sentBy,
        friendUserId: membersInfo[0]?.userId,
        friendDisplayName: membersInfo[0]?.displayName,
        friendPhotoURL: membersInfo[0]?.photoURL,
      });
    } else {
      navigation.navigate("ChatScreen", {
        groupId: chat.groupId,
        groupName: chat.groupName,
        groupMembers: chat.members,
        unreadMsgs: unreadMsgs,
        // friendUserId: membersInfo[0]?.userId,
        friendDisplayName: membersInfo.length,
        // friendPhotoURL: membersInfo[0]?.photoURL,
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
    <Swipeable renderRightActions={rightSwipeActions}>
      <ListItem onPress={goToChatScreen}>
        {membersInfo.length === 1 ? (
          <Avatar
            size="medium"
            source={{ uri: membersInfo[0]?.photoURL }}
            rounded
          />
        ) : (
          <View
            style={{
              backgroundColor: "#bdc3c7",
              height: 50,
              width: 50,
              borderRadius: 25,
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 42,
                paddingVertical: 3,
              }}
            >
              {membersInfo.length}
            </Text>
          </View>
        )}
        <View style={{ position: "absolute", top: 13, left: 52 }}>
          {unreadMsgs.length > 0 && (
            <Badge
              value={unreadMsgs.length}
              textStyle={{ fontSize: 12 }}
              badgeStyle={{
                width: 23,
                height: 23,
                borderRadius: 15,
                borderColor: "#fff",
                borderWidth: 2,
                backgroundColor: "#9b59b6",
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
            <ListItem.Title style={{ fontWeight: "bold" }}>
              {memberNames.join(", ")}
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
              title="check members"
              onPress={() => console.log("members in here", memberNames)}
            /> */}
            {/* <Button
              title="check unread msgs"
              onPress={() => console.log("see all unread msgs", unreadMsgs)}
            /> */}
          </View>
          <ListItem.Subtitle numberOfLines={2} ellipsizeMode="tail">
            {chat.lastMessage?.message}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </Swipeable>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
