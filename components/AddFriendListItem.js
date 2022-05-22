import { StyleSheet, Text, View, Pressable } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const AddFriendListItem = ({ user }) => {
  return (
    <ListItem>
      <Avatar source={{ uri: user.photoURL }} rounded size="medium" />
      <ListItem.Content>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ListItem.Title
            style={{
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            {user.displayName}
          </ListItem.Title>
          <ListItem.Title>
            <Pressable onPress={() => alert(`adding ${user.displayName}`)}>
              <Ionicons name="add-circle" size={24} color="#22a6b3" />
            </Pressable>
          </ListItem.Title>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default AddFriendListItem;

const styles = StyleSheet.create({});
