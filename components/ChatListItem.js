import { StyleSheet, Text, View, Pressable, Alert, Button } from "react-native";
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
import { Avatar, ListItem, Icon } from "react-native-elements";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

const ChatListItem = ({ chat, navigation }) => {
  const [members, setMembers] = useState([]);
  const [membersInfo, setMembersInfo] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const groupRef = doc(db, "groups", chat.groupId);
  const chatRef = doc(db, "chats", chat.groupId);
  const q = query(chatRef);

  // const memberRef = doc(db, "users", members[0]);
  // const qMembersInfo = query(memberRef);

  // console.log("these are the members array:", members);
  // console.log("these are the member id's:", members[0]);

  useEffect(() => {
    let chatMember = [];

    chat.members.forEach((member) => {
      if (member !== user.uid) {
        chatMember.push(member);
      }
    });

    const memberID = chatMember[0];

    console.log("this is it:", chatMember);
    console.log("this is it:", chatMember[0]);

    const memberRef = doc(db, "users", memberID);

    const unsubMembersInfo = onSnapshot(memberRef, (doc) => {
      console.log("Current data: ", doc.data());
      setMembersInfo(() => {
        return { ...doc.data() };
      });
    });

    return unsubMembersInfo;
  }, []);

  // useEffect(() => {
  //   setMembers(
  //     chat.members.filter((member) => {
  //       if (member !== user.uid) {
  //         return member;
  //       }
  //     })
  //   );
  // }, []);

  // useEffect(() => {
  //   if (members.length > 0) {
  //     const unsubMembersInfo = onSnapshot(qMembersInfo, (querySnapshot) => {
  //       setMembersInfo(
  //         querySnapshot.docs.map((doc) => {
  //           return { ...doc.data() };
  //         })
  //       );
  //     });

  //     return unsubMembersInfo;
  //   }
  // }, [members]);

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
            friendUserId: membersInfo?.userId,
            friendDisplayName: membersInfo?.displayName,
            friendPhotoURL: membersInfo?.photoURL,
          });
          // alert("going to chat screen");
        }}
      >
        <Avatar size="medium" source={{ uri: membersInfo?.photoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <ListItem.Title style={{ fontWeight: "bold" }}>
              {membersInfo?.displayName}
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
              onPress={() => console.log("members in here", members)}
            />
            <Button
              title="check members info"
              onPress={() => console.log("members info", membersInfo)}
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
