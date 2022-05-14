import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, doc, query, where, onSnapshot } from "firebase/firestore";
import ChatListItem from "../../components/ChatListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ChatsScreen = () => {
  const [chats, setChats] = useState("");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = collection(userRef, "chats");
  const q = query(chatsRef);

  useEffect(() => {
    const unsubChats = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });

    return unsubChats;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Chats</Text>
        <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
      </View>
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        keyExtractor={(item) => item.chatId}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 80, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="chat-remove"
              size={60}
              color="#bdc3c7"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  profilePic: {
    borderRadius: 15,
    height: 30,
    width: 30,
    alignSelf: "center",
  },
});
