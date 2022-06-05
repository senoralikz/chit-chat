import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
import Toast from "react-native-toast-message";

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>Friends</Text>
          {friends.length === 1 && (
            <View style={{ justifyContent: "center" }}>
              <Text style={{ paddingLeft: 5, fontSize: 22 }}>
                ({friends.length})
              </Text>
            </View>
          )}
          {friends.length > 1 && (
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  paddingLeft: 5,
                  fontSize: 22,
                }}
              >
                ({friends.length})
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => navigation.navigate("AddContactScreen")}
          // onPress={() => alert("adding a new contact")}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="ios-person-add" size={28} color="#22a6b3" />
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
        style={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default ContactsListScreen;

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
