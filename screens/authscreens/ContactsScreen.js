import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import ContactListItem from "../../components/ContactListItem";

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 36, fontWeight: "800" }}>Contacts</Text>
        <Pressable
          onPress={() => navigation.navigate("AddContactScreen")}
          // onPress={() => alert("adding a new contact")}
          style={{ alignSelf: "center" }}
        >
          <Ionicons name="ios-person-add" size={28} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={contacts}
        renderItem={({ item }) => <ContactListItem contact={item} />}
        keyExtractor={(item) => item.contactId}
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
