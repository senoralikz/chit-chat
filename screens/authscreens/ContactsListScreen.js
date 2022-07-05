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
import { Button } from "react-native-elements";

const ContactsListScreen = ({ navigation }) => {
  const [friendIds, setFriendIds] = useState([]);
  const [friendInfo, setFriendInfo] = useState([]);

  const user = auth.currentUser;

  const friendsRef = collection(db, "users", user.uid, "friends");

  useEffect(() => {
    // let unsortedFriends = []

    const unsubFriendIds = onSnapshot(friendsRef, (querySnapshot) => {
      // querySnapshot.docs.map((doc) => {
      //   unsortedFriends.push(doc.data())
      // })

      setFriendIds(
        querySnapshot.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    });

    // unsortedFriends.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // setFriendIds(unsortedFriends)

    return unsubFriendIds;
  }, []);

  useEffect(() => {
    if (friendIds.length > 0) {
      const extractFriendId = friendIds.map((friendId) => {
        return friendId.userId;
      });
      const q = query(
        collection(db, "users"),
        where("userId", "in", extractFriendId),
        orderBy("displayName")
      );
      const unsubFriendInfo = onSnapshot(q, (querySnapshot) => {
        let gettingFriends = [];
        querySnapshot.forEach((doc) => {
          gettingFriends.push(doc.data());
        });
        // console.log("listening to these friends:", gettingFriends);
        setFriendInfo(gettingFriends);
      });

      return unsubFriendInfo;
    }
  }, [friendIds]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 36, fontWeight: "800" }}>Friends</Text>
          {friendIds.length > 0 && (
            <View style={{ justifyContent: "center" }}>
              <Text style={{ paddingLeft: 5, fontSize: 22 }}>
                ({friendIds.length})
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
  }, [navigation, friendIds]);

  return (
    <View style={styles.container}>
      {/* <Button
        title="check friends"
        onPress={() => {
          console.log("checking friends info:", friendInfo);
          // console.log("checking friend ids:", friendIds);
        }}
      /> */}
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
        data={friendInfo}
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
