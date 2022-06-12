import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ContactListItem from "../../components/ContactListItem";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const ContactsListScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

  const user = auth.currentUser;

  const friendsRef = collection(db, "users", user.uid, "friends");
  const q = query(friendsRef, orderBy("displayName"));

  useEffect(() => {
    const unsubFriends = onSnapshot(q, (querySnapshot) => {
      setFriends(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });
    return unsubFriends;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>Friends</Text>
          {friends.length > 0 && (
            <View style={{ justifyContent: "center" }}>
              <Text style={{ paddingLeft: 5, fontSize: 22 }}>
                ({friends.length})
              </Text>
            </View>
          )}
        </View>
      ),
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate("AddContactScreen")}>
          <Ionicons name="ios-person-add" size={28} color="#22a6b3" />
        </Pressable>
      ),
    });
  }, [navigation, friends]);

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
        data={friends}
        renderItem={({ item }) => (
          <ContactListItem friend={item} navigation={navigation} />
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
    </View>
  );
};

export default ContactsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
