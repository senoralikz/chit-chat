import { useEffect, useState } from "react";
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
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import ChatListItem from "../../components/ChatListItem";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatsListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [totalUnreadMsgs, setTotalUnreadMsgs] = useState(0);

  const user = auth.currentUser;
  const groupsRef = collection(db, "groups");
  const q = query(
    groupsRef,
    where("members", "array-contains", user.uid),
    orderBy("lastModified", "desc")
  );

  useEffect(() => {
    const unsubChatDetails = onSnapshot(q, (querySnapshot) => {
      setChats(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });

    return unsubChatDetails;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          source={{ uri: user.photoURL }}
          size="small"
          rounded
          onPress={() => navigation.navigate("Profile")}
          containerStyle={{ alignSelf: "center" }}
        />
        <Text
          style={{
            fontSize: 36,
            fontWeight: "800",
          }}
        >
          Chats
        </Text>
        <Pressable
          // onPress={() => alert("creating a new chat")}
          onPress={() => navigation.navigate("SelectChattersScreen")}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="create-outline" size={28} color="#22a6b3" />
        </Pressable>
      </View>
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
