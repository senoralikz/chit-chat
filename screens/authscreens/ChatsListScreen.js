import { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  onSnapshot,
  getDoc,
  orderBy,
} from "firebase/firestore";
import ChatListItem from "../../components/ChatListItem";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { UnreadMsgContext } from "../../context/UnreadMsgContext";
import { useRoute } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const ChatsListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userFriendIds, setUserFriendIds] = useState([]);
  const [friends, setFriends] = useState("");
  const { totalUnreadMsgs, setTotalUnreadMsgs } = useContext(UnreadMsgContext);

  const toast = useToast();

  const user = auth.currentUser;
  const currentRoute = useRoute();
  const friendsRef = collection(db, "users", user.uid, "friends");
  const groupsRef = collection(db, "groups");
  const q = query(
    groupsRef,
    where("members", "array-contains", user.uid),
    orderBy("lastMessage.createdAt", "desc")
    // orderBy("lastModified", "desc")
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerTitleStyle: { fontSize: 36, fontWeight: "800" },
      headerLeft: () => (
        <View style={{ paddingLeft: 10 }}>
          <Avatar
            source={{ uri: user.photoURL }}
            size="small"
            rounded
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      ),
      headerRight: () => (
        <Pressable
          onPress={() =>
            navigation.navigate("SelectChattersListScreen", {
              userFriendIds: userFriendIds,
            })
          }
          // onPress={() => setModalVisible(true)}
          style={{ paddingRight: 10 }}
        >
          <Ionicons name="create-outline" size={28} color="#9b59b6" />
        </Pressable>
      ),
    });
  }, [navigation, userFriendIds]);

  useEffect(() => {
    const unsubChatDetails = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data(), groupId: doc.id };
        })
      );
    });

    return unsubChatDetails;
  }, []);

  useEffect(() => {
    // let totalMsgs = 0;
    let totalMsgs = [];
    chats.forEach(async (chat) => {
      const messagesRef = collection(db, "chats", chat.groupId, "messages");
      const q = query(
        messagesRef,
        where("readBy", "array-contains", {
          readMsg: false,
          userId: user.uid,
        })
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // totalMsgs++;
        totalMsgs.push(doc.data());
      });

      setTotalUnreadMsgs(totalMsgs.length);
    });
    // setTotalUnreadMsgs(totalMsgs);
  }, [chats]);

  useEffect(() => {
    const unsubFriendIds = onSnapshot(friendsRef, (querySnapshot) => {
      setUserFriendIds(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });
    return unsubFriendIds;
  }, []);

  useEffect(() => {
    if (currentRoute.name !== "ChatScreen") {
      if (chats.length > 0 && chats[0].lastMessage?.sentBy !== user.uid) {
        toast.show(chats[0].lastMessage?.message, {
          type: "newMessage",
          message: chats[0].lastMessage?.message,
          displayName: chats[0].lastMessage?.senderDisplayName,
          photoURL: chats[0].lastMessage?.senderPhotoURL,
          createdAt: new Date(
            chats[0].lastMessage?.createdAt * 1000
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          placement: "top",
          duration: 5000,
        });
      }
    }
  }, [chats]);

  // useEffect(() => {
  //   fetchFriendsInfo();
  // }, [userFriendIds]);

  // const fetchFriendsInfo = () => {
  //   try {
  //     let friendsInfo = [];
  //     userFriendIds.forEach(async (friendId) => {
  //       const friendRef = doc(db, "users", friendId.userId);
  //       const docSnap = await getDoc(friendRef);
  //       friendsInfo.push({ ...docSnap.data(), chattingWith: false });
  //     });
  //     friendsInfo.sort((a, b) => a.displayName.localeCompare(b.displayName));
  //     setFriends(friendsInfo);
  //   } catch (error) {
  //     toast.show(error.message, {
  //       type: "danger",
  //     });
  //   }
  // };

  return (
    <View style={styles.container}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              borderBottomColor: "#dfe6e9",
              borderBottomWidth: 1,
            }}
          />
        )}
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem chat={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.groupId}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 80, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="chat-remove"
              size={60}
              color="#bdc3c7"
            />
            <Text style={{ fontSize: 18, color: "#bdc3c7" }}>No Chats</Text>
          </View>
        )}
        // style={{ paddingTop: 10 }}
      />
      {/* <Button
        title="Check friends"
        onPress={() => console.log("reading friends from chat lists:", friends)}
      /> */}
    </View>
  );
};

export default ChatsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // header: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   paddingHorizontal: 5,
  // },
});
