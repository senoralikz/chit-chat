import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { SearchBar } from "react-native-elements";
import ChatFriendListItem from "../../components/ChatFriendListItem";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const SelectChattersListModal = ({ modalVisible, setModalVisible }) => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState("");
  const [filteredFriends, setFilteredFriends] = useState("");
  const [chatWith, setChatWith] = useState([]);

  const user = auth.currentUser;

  const friendsRef = collection(db, "users", user.uid, "friends");
  const q = query(friendsRef, orderBy("displayName"));

  useEffect(() => {
    console.log("friends in the chatWith state", chatWith);
  }, [chatWith]);

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
    setFilteredFriends(friends);
  }, [friends]);

  // const selectingChatters = (selectedChatter, checked) => {
  //   if (checked) {
  //     let chatters = chatWith;
  //     chatters.push(selectedChatter);
  //     // console.log("chatting with these people", chatters);
  //     setChatWith(chatters);
  //   } else {
  //     let chatters = chatWith.filter((chatter) => {
  //       if (chatter.userId !== selectedChatter.userId) {
  //         return chatter;
  //       }
  //     });
  //     // console.log("chatting with these people", chatters);
  //     setChatWith(chatters);
  //   }
  // };

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
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setChatWith([]);
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setModalVisible(false);
            setChatWith([]);
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <Ionicons name="chevron-back" size={32} color="#9b59b6" />
          </View>
        </Pressable>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>New Message</Text>
        </View>
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
            height: 25,
            justifyContent: "center",
          }}
        >
          <View style={{ justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 18 }}>Chat With: </Text>
          </View>
          {/* {chatWith.length > 0 &&
            chatWith.map((friend) => (
              <View key={friend.userId}>
                <Text>{friend.displayName}, </Text>
              </View>
            ))} */}
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={{ justifyContent: "flex-end" }}>
                <Text style={{ fontSize: 22 }}>, </Text>
              </View>
            )}
            data={chatWith}
            renderItem={({ item }) => (
              <View style={{ justifyContent: "flex-end" }}>
                <Text style={{ fontSize: 22, fontWeight: "600" }}>
                  {item.displayName}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.userId}
            horizontal={true}
          />
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
              chatWith={chatWith}
              setChatWith={setChatWith}
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
