import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ContactListItem from "../../components/ContactListItem";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";

const ContactsScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const friendsRef = collection(userRef, "friends");
  const q = query(friendsRef);

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

  // const getFriends = async () => {
  //   try {
  //     const gettingFriends = await getDocs(friendsRef);
  //     setFriends(
  //       gettingFriends.map((friend) => {
  //         return { ...friend.data() };
  //       })
  //     );
  //   } catch (error) {
  //     Alert.alert(error.code, error.message, { text: "Ok" });
  //     console.error(error.code, "-- error getting friends --", error.message);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Friends</Text>
        <Pressable
          onPress={() => navigation.navigate("AddContactScreen")}
          // onPress={() => alert("adding a new contact")}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="ios-person-add" size={28} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={friends}
        renderItem={({ item }) => <ContactListItem contact={item} />}
        keyExtractor={(item) => item.friendUserId}
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

export default ContactsScreen;

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
