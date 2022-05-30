import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SearchBar } from "react-native-elements";
import ChatFriendListItem from "../../components/ChatFriendListItem";
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const SelectChattersListScreen = () => {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState("");
  const [filteredFriends, setFilteredFriends] = useState("");

  const user = auth.currentUser;

  const friendsRef = collection(db, "users", user.uid, "friends");
  const q = query(friendsRef, orderBy("displayName"));

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  const getFriends = async () => {
    try {
      let gettingFriends = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        gettingFriends.push(doc.data());
      });
      setFriends(gettingFriends);
    } catch (error) {
      console.error(
        error.code,
        "-- error getting friends in select friends for chat screen --",
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
        }}
        inputContainerStyle={{ backgroundColor: "#ececec" }}
        inputStyle={{ color: "#000" }}
        round
        lightTheme
      />
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
        renderItem={({ item }) => <ChatFriendListItem friend={item} />}
        keyExtractor={(item) => item.userId}
        // ListEmptyComponent={() => (
        //   <View style={{ marginTop: 80, alignItems: "center" }}>
        //     <MaterialCommunityIcons
        //       name="account-remove"
        //       size={60}
        //       color="#bdc3c7"
        //     />
        //     <Text style={{ fontSize: 18, color: "#bdc3c7" }}>No Friends</Text>
        //   </View>
        // )}
        style={{ paddingTop: 10 }}
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
