import { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { Button, SearchBar } from "react-native-elements";
import ChatFriendListItem from "../../components/ChatFriendListItem";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  orderBy,
  query,
  onSnapshot,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useToast } from "react-native-toast-notifications";
import SelectChatsListModal from "./SelectChatsListModal";

const SelectChattersListScreen = ({
  route,
  navigation,
  navigation: { goBack },
}) => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState();
  const [filteredFriends, setFilteredFriends] = useState();
  const [chatWith, setChatWith] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chatterIds, setChatterIds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState([]);

  const user = auth.currentUser;
  const toast = useToast();

  const friendsRef = collection(db, "users", user.uid, "friends");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Select Chatters",
      headerBackTitleVisible: false,
      headerLeft: () => (
        <Pressable
          style={{ justifyContent: "center" }}
          onPress={() => goBack()}
        >
          <Ionicons name="chevron-back" size={32} color="#9b59b6" />
        </Pressable>
      ),
      headerRight: () => (
        <Button
          title="Create Chat"
          onPress={checkForExistingChats}
          containerStyle={{
            borderRadius: 10,
          }}
          buttonStyle={{ backgroundColor: "#9b59b6" }}
          disabled={chatterIds.length > 0 ? false : true}
        />
      ),
    });
  }, [navigation, chatterIds]);

  useEffect(() => {
    const extractFriendId = route.params.userFriendIds.map((friendId) => {
      return friendId.userId;
    });

    const q = query(
      collection(db, "users"),
      where("userId", "in", extractFriendId),
      orderBy("displayName")
    );
    const unsubFriendInfo = onSnapshot(q, (querySnapshot) => {
      let gettingFriends = [];
      querySnapshot.forEach((doc) => {
        gettingFriends.push({ ...doc.data(), chattingWith: false });
      });
      // console.log("listening to these friends:", gettingFriends);
      setFriends(gettingFriends);
    });

    return unsubFriendInfo;
  }, []);

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  // const fetchFriendsInfo = () => {
  //   let friendsInfo = [];
  //   userFriendIds.forEach(async (friendId) => {
  //     const friendRef = doc(db, "users", friendId.userId);
  //     const docSnap = await getDoc(friendRef);
  //     friendsInfo.push({ ...docSnap.data(), chattingWith: false });
  //   });
  //   friendsInfo.sort((a, b) => a.displayName.localeCompare(b.displayName));
  //   setFriends(friendsInfo);
  // };

  const checkForExistingChats = async () => {
    try {
      let gettingGroups = [];
      let matchingGroups = [];
      let gettingAllChatterIds = chatterIds;
      console.log("chatters ids before adding user uid:", chatterIds);
      {
        !gettingAllChatterIds.some((id) => id === user.uid) &&
          gettingAllChatterIds.push(user.uid);
      }

      console.log("chatters ids after adding user uid:", gettingAllChatterIds);

      const groupsRef = collection(db, "groups");
      const qGroups = query(
        groupsRef,
        where("members", "array-contains", user.uid),
        orderBy("lastModified", "desc")
      );

      const querySnapshot = await getDocs(qGroups);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        gettingGroups.push(doc.data());
      });

      gettingGroups.forEach((group) => {
        if (
          gettingAllChatterIds.every((id) => {
            return group.members.includes(id);
          })
        ) {
          matchingGroups.push(group);
        }
      });

      if (matchingGroups.length > 0) {
        setGroups(matchingGroups);
        setModalVisible(true);
      } else {
        let memberNames = [];
        chatWith.forEach((chatter) => memberNames.push(chatter.displayName));

        const groupDoc = await addDoc(groupsRef, {
          groupName: "",
          members: gettingAllChatterIds,
        })
          .then(async (groupDoc) => {
            // console.log("new group id:", groupDoc.id);
            await updateDoc(doc(groupsRef, groupDoc.id), {
              groupId: groupDoc.id,
            });
            if (chatWith.length === 1) {
              navigation.navigate("ChatScreen", {
                friendUserId: chatWith[0].userId,
                friendPhotoURL: chatWith[0].photoURL,
                friendDisplayName: chatWith[0].displayName,
                groupMembers: gettingAllChatterIds,
                groupId: groupDoc.id,
                unreadMsgs: unreadMsgs,
              });
            } else {
              navigation.navigate("GroupChatScreen", {
                groupId: groupDoc.id,
                // groupName: chat.groupName,
                groupMembers: gettingAllChatterIds,
                unreadMsgs: unreadMsgs,
                // friendUserId: membersInfo[0]?.userId,
                friendDisplayName: memberNames,
                // friendPhotoURL: membersInfo[0]?.photoURL,
              });
            }
          })
          .catch((error) => {
            toast.show(error.message, {
              type: "danger",
            });
            console.error(
              error.code,
              "-- error adding new group --",
              error.message
            );
          });
      }
    } catch (error) {
      toast.show(error.message, {
        type: "danger",
      });
      console.error(
        error.code,
        "-- Error getting available chats --",
        error.message
      );
    }
  };

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the usersSearchResult
      // Update usersFiltered
      const newData = friends.filter((item) => {
        const itemData = item.displayName
          ? item.displayName.toLowerCase()
          : "".toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredFriends(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update usersFiltered with usersSearchResult
      setFilteredFriends(friends);
      setSearch(text);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Friends..."
        value={search}
        onChangeText={(text) => searchFilterFunction(text)}
        containerStyle={{
          backgroundColor: "transparent",
          borderBottomWidth: 0,
          borderTopWidth: 0,
        }}
        inputContainerStyle={{ backgroundColor: "#ececec" }}
        inputStyle={{ color: "#000" }}
        round
        lightTheme
      />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          marginTop: 5,
          height: 30,
        }}
      >
        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
        <View style={{ justifyContent: "flex-end" }}>
          <Text style={{ fontSize: 18 }}>Chat With: </Text>
        </View>

        {chatWith.length > 0 && (
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {chatWith.map((friend) => (
              <View
                key={friend.userId}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  backgroundColor: "#9b59b6",
                  borderRadius: 5,
                  marginHorizontal: 3,
                  marginBottom: 2,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  maxWidth: 100,
                  // height: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "600",
                    color: "#fff",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {friend.displayName}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      {/* <Button
        title="check params friends"
        onPress={() => console.log("checking params friends:", extractFriendId)}
      /> */}
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              borderBottomColor: "#dfe6e9",
              borderBottomWidth: 1,
            }}
          />
        )}
        data={filteredFriends}
        renderItem={({ item }) => (
          <ChatFriendListItem
            friend={item}
            friends={friends}
            setFriends={setFriends}
            chatWith={chatWith}
            setChatWith={setChatWith}
            modalVisible={modalVisible}
            chatterIds={chatterIds}
            setChatterIds={setChatterIds}
            // selectingChatters={selectingChatters}
          />
        )}
        keyExtractor={(item) => item.userId}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 80, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="account-remove"
              size={60}
              color="#bdc3c7"
            />
            <Text style={{ fontSize: 18, color: "#bdc3c7" }}>No Friends</Text>
          </View>
        )}
        // style={{ paddingTop: 10 }}
      />
      <SelectChatsListModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        groups={groups}
        navigation={navigation}
        chatWith={chatWith}
        chatterIds={chatterIds}
      />
    </View>
  );
};

export default SelectChattersListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});