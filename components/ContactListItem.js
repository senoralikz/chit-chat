import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const ContactListItem = ({ friend, navigation }) => {
  const [friendInfo, setFriendInfo] = useState("");
  const [groups, setGroups] = useState("");

  const user = auth.currentUser;

  const groupsRef = collection(db, "groups");
  const friendRef = doc(db, "users", friend.userId);
  const qGroups = query(
    groupsRef,
    where("members", "in", [
      [user.uid, friend.userId],
      [friend.userId, user.uid],
    ])
    // where("members", "in", [
    //   [
    //     {
    //       userId: user.uid,
    //       displayName: user.displayName,
    //       photoURL: user.photoURL,
    //     },
    //     {
    //       userId: friend.userId,
    //       displayName: friend.displayName,
    //       photoURL: friend.photoURL,
    //     },
    //   ],
    //   [
    //     {
    //       userId: friend.userId,
    //       displayName: friend.displayName,
    //       photoURL: friend.photoURL,
    //     },
    //     {
    //       userId: user.uid,
    //       displayName: user.displayName,
    //       photoURL: user.photoURL,
    //     },
    //   ],
    // ])
  );

  useEffect(() => {
    // console.log("user id is", user.uid);
    // console.log("friend id is", friend.userId);

    const unsubGroups = onSnapshot(qGroups, (snapshot) => {
      setGroups(
        snapshot.docs.map((doc) => {
          // console.log(
          //   "checking doc data from contact list item",
          //   doc.data(),
          //   "and doc id is:",
          //   doc.id
          // );
          return {
            ...doc.data(),
          };
        })
      );
    });

    return unsubGroups;
  }, []);

  useEffect(() => {
    const unsubFriendInfo = onSnapshot(friendRef, (doc) => {
      console.log("Current data: ", doc.data());
      setFriendInfo(() => {
        return { ...doc.data() };
      });
    });

    return unsubFriendInfo;
  }, []);

  const goToChatScreen = async () => {
    try {
      if (groups.length === 0) {
        const groupDoc = await addDoc(groupsRef, {
          members: [user.uid, friend.userId],
        })
          .then(async (groupDoc) => {
            console.log("new group id:", groupDoc.id);
            await updateDoc(doc(groupsRef, groupDoc.id), {
              groupId: groupDoc.id,
            });
            navigation.navigate("ChatScreen", {
              friendUserId: friend.userId,
              groupId: groupDoc.id,
            });
          })
          .catch((error) =>
            console.error(
              error.code,
              "-- error adding new group --",
              error.message
            )
          );
      } else {
        navigation.navigate("ChatScreen", {
          friendUserId: friend.userId,
          // groups,
          groupId: groups[0].groupId,
        });
      }
    } catch (error) {
      console.error(
        error.code,
        "-- error going to chat screen --",
        error.message
      );
    }
  };

  const deleteFriend = async () => {
    try {
      const user = auth.currentUser;
      const friendRef = doc(db, "users", user.uid, "friends", friend.userId);
      await deleteDoc(friendRef);
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(error.code, "-- error deleting friend --", error.message);
    }
  };

  const rightSwipeActions = () => {
    return (
      <Pressable onPress={deleteFriend}>
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
      <ListItem>
        <Avatar size="medium" source={{ uri: friendInfo.photoURL }} rounded />
        <ListItem.Content>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItem.Title
              style={{
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {friendInfo.displayName}
            </ListItem.Title>
            <ListItem.Title>
              <Pressable onPress={goToChatScreen}>
                <Ionicons name="chatbubble" size={24} color="#9b59b6" />
              </Pressable>
            </ListItem.Title>
          </View>
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({});
