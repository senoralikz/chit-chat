import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, SafeAreaView } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { SearchBar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import {
  query,
  collection,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import AddFriendListItem from "../../components/AddFriendListItem";

const AddContactScreen = () => {
  const [search, setSearch] = useState("");
  const [usersSearchResult, setUsersSearchResult] = useState([]);
  const [usersFiltered, setUsersFiltered] = useState([]);
  const [friends, setFriends] = useState([]);

  const user = auth.currentUser;
  const usersCollRef = collection(db, "users");
  const q = query(
    usersCollRef,
    where("displayName", "!=", user.displayName),
    orderBy("displayName")
  );

  useEffect(() => {
    const unsubUsers = onSnapshot(q, (querySnapshot) => {
      setUsersSearchResult(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });

    return unsubUsers;
  }, []);

  useEffect(() => {
    const friendsRef = collection(db, "users", user.uid, "friends");
    const unsubFriends = onSnapshot(friendsRef, (querySnapshot) => {
      setFriends(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });

    return unsubFriends;
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the usersSearchResult
      // Update usersFiltered
      const newData = usersSearchResult.filter((item) => {
        const itemData = item.displayName
          ? item.displayName.toLowerCase()
          : "".toLowerCase();
        const textData = text.toLowerCase();
        return itemData.indexOf(textData) > -1;
      });
      setUsersFiltered(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update usersFiltered with usersSearchResult
      setUsersFiltered("");
      setSearch(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search Users..."
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
        data={usersFiltered}
        renderItem={({ item }) => (
          <AddFriendListItem user={item} currentFriends={friends} />
        )}
        keyExtractor={(item) => item.userId}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 80, alignItems: "center" }}>
            <MaterialIcons name="person-search" size={60} color="#bdc3c7" />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AddContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
