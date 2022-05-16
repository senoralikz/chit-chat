import { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

const AddContactScreen = () => {
  const [search, setSearch] = useState("");
  const [usersResult, setUsersResult] = useState("");

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Search"
        value={search}
        onChangeText={(text) => setSearch(text)}
        round
        lightTheme
        showCancel
      />
      <FlatList
        data={usersResult}
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

const styles = StyleSheet.create({});
