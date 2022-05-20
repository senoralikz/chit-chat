import { FlatList, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, collection, getDocs, query } from "firebase/firestore";
import ChatFriendListItem from "../../components/ChatFriendListItem";

const SelectChattersScreen = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState("");
  const [friends, setFriends] = useState([]);

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const friendsRef = collection(userRef, "friends");
  const q = query(friendsRef);

  useEffect(() => {
    getFriends();
  }, []);

  const getFriends = async () => {
    try {
      const querySnapshot = await getDocs(q);
      setFriends(
        querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          return { ...doc.data(), friendDocId: doc.id };
        })
      );
    } catch (error) {
      Alert.alert(error.code, error.message, { text: "Ok" });
      console.error(
        error.code,
        "-- error getting friends in create chat screen",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Friends..."
        onChangeText={(text) => setSearchInput(text)}
        value={searchInput}
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
        data={friends}
        renderItem={({ item }) => (
          <ChatFriendListItem friend={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.friendDocId}
      />
    </View>
  );
};

export default SelectChattersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
