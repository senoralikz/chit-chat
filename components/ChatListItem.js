import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
  orderBy,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Avatar, ListItem, Button, Icon } from "react-native-elements";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

const ChatListItem = ({ chat, navigation }) => {
  const [members, setMembers] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const groupRef = doc(db, "groups", chat.groupId);
  const chatRef = doc(db, "chats", chat.groupId);
  const q = query(chatRef);

  useEffect(() => {
    setMembers(
      chat.members.filter((member) => {
        if (member.userId !== user.uid) {
          return member;
        }
      })
    );
  }, []);

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
      await deleteDoc(groupRef);
      deleteMessagesColl();
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting chat --", error.message);
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
      <ListItem
        onPress={() => {
          navigation.navigate("ChatScreen", {
            groupId: chat.groupId,
            friendUserId: members[0]?.userId,
            friendDisplayName: members[0]?.displayName,
            friendPhotoURL: members[0]?.photoURL,
          });
          // alert("going to chat screen");
        }}
      >
        <Avatar size="medium" source={{ uri: members[0]?.photoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ListItem.Title style={{ fontWeight: "bold" }}>
              {members[0]?.displayName}
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
