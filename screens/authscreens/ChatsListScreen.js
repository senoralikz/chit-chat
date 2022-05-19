import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, doc, query, where, onSnapshot } from "firebase/firestore";
import ChatListItem from "../../components/ChatListItem";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

const ChatsListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const chatsRef = collection(userRef, "chats");
  const q = query(chatsRef);

  useEffect(() => {
    const unsubChats = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data(), chatId: doc.id };
        })
      );
    });

    return unsubChats;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={{ uri: user.photoURL }}
          size="small"
          rounded
          onPress={() => navigation.navigate("Profile")}
        />
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Chats</Text>
        <Pressable
          onPress={() => navigation.navigate("AddChatScreen")}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="create-outline" size={28} color="#22a6b3" />
        </Pressable>
      </View>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatListItem chat={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.chatId}
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
        style={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default ChatsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
});