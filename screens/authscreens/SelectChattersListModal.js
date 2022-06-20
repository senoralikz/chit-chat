import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Button, SearchBar } from "react-native-elements";
import ChatFriendListItem from "../../components/ChatFriendListItem";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useToast } from "react-native-toast-notifications";

const SelectChattersListModal = ({ modalVisible, setModalVisible }) => {
  const user = auth.currentUser;
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState("");
  const [filteredFriends, setFilteredFriends] = useState("");
  const [chatWith, setChatWith] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chatterIds, setChatterIds] = useState([]);

  const friendsRef = collection(db, "users", user.uid, "friends");
  const q = query(friendsRef, orderBy("displayName"));

  useEffect(() => {
    const unsubFriends = onSnapshot(q, (querySnapshot) => {
      setFriends(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data(), chattingWith: false };
        })
      );
    });
    return unsubFriends;
  }, []);

  useEffect(() => {
    if (!modalVisible && friends.length > 0) {
      setFriends(
        friends.map((person) => {
          return { ...person, chattingWith: false };
        })
      );
      setChatWith([]);
    }
  }, [modalVisible]);

  // useEffect(() => {
  //   // console.log("user id is", user.uid);
  //   // console.log("friend id is", friend.userId);
  //   const groupsRef = collection(db, "groups");
  //   const qGroups = query(groupsRef, where("members", "in", [chatterIds]));

  //   const unsubGroups = onSnapshot(qGroups, (snapshot) => {
  //     setGroups(
  //       snapshot.docs.map((doc) => {
  //         // console.log(
  //         //   "checking doc data from contact list item",
  //         //   doc.data(),
  //         //   "and doc id is:",
  //         //   doc.id
  //         // );
  //         return {
  //           ...doc.data(),
  //           groupId: doc.id,
  //         };
  //       })
  //     );
  //   });

  //   return unsubGroups;
  // }, []);

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

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

  const closingModal = () => {
    let resetFriendsChattingWith = friends;
    resetFriendsChattingWith.forEach((friend) => friend.chattingWith === false);
    setFriends(resetFriendsChattingWith);
    setModalVisible(false);
    setChatWith([]);
  };

  // const goToChatScreen = async () => {
  //   try {
  //     if (groups.length === 0) {
  //       const groupDoc = await addDoc(groupsRef, {
  //         groupName: "",
  //         members: [user.uid, friend.userId],
  //       })
  //         .then(async (groupDoc) => {
  //           console.log("new group id:", groupDoc.id);
  //           await updateDoc(doc(groupsRef, groupDoc.id), {
  //             groupId: groupDoc.id,
  //           });
  //           navigation.navigate("ChatScreen", {
  //             friendUserId: friend.userId,
  //             friendPhotoURL: friend.photoURL,
  //             friendDisplayName: friend.displayName,
  //             groupMembers: [user.uid, friend.userId],
  //             groupId: groupDoc.id,
  //             unreadMsgs: unreadMsgs,
  //           });
  //         })
  //         .catch((error) =>
  //           console.error(
  //             error.code,
  //             "-- error adding new group --",
  //             error.message
  //           )
  //         );
  //     } else {
  //       navigation.navigate("ChatScreen", {
  //         friendUserId: friend.userId,
  //         friendPhotoURL: friend.photoURL,
  //         friendDisplayName: friend.displayName,
  //         groupMembers: chatWith,
  //         groupId: groups[0].groupId,
  //         unreadMsgs: unreadMsgs,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(
  //       error.code,
  //       "-- error going to chat screen --",
  //       error.message
  //     );
  //   }
  // };

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      // onRequestClose={closingModal}
      onRequestClose={() => {
        setChatWith([]);
        setModalVisible(false);
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
        }}
      >
        <Pressable
          style={{ justifyContent: "center" }}
          // onPress={closingModal}
          onPress={() => {
            setChatWith([]);
            setModalVisible(false);
          }}
        >
          <Ionicons name="chevron-back" size={32} color="#9b59b6" />
        </Pressable>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>New Message</Text>
        </View>
        <Button
          title="Create Chat"
          titleStyle={{ fontWeight: "bold" }}
          // onPress={goToChatScreen}
          onPress={() => {
            // console.log("friends in the chatWith state", chatWith);
            // console.log("friends in the chatterIds state", chatterIds);
            // console.log("all friends:", friends);

            toast.show("Creating a chat", {
              type: "success",
              placement: "top",
            });
          }}
          containerStyle={{
            marginTop: 5,
            borderRadius: 10,
          }}
          buttonStyle={{ backgroundColor: "#9b59b6" }}
        />
      </View>
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
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
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

          {/* <FlatList
            data={chatWith}
            ListHeaderComponent={() => (
              <View style={{ paddingTop: 7 }}>
                <Text style={{ fontSize: 18 }}>Chat With: </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View
                key={item.userId}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  backgroundColor: "#9b59b6",
                  borderRadius: 5,
                  marginHorizontal: 3,
                  // marginBottom: 9,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  // maxWidth: "95%",
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
                  {item.displayName}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.userId}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          /> */}
        </View>
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
          style={{ paddingTop: 10 }}
        />
      </View>
      <StatusBar style="light" />
    </Modal>
  );
};

export default SelectChattersListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
