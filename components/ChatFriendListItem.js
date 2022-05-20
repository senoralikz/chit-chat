import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const ChatFriendListItem = ({ friend, navigation }) => {
  const handleChat = () => {
    alert(`chatting with ${friend.friendDisplayName}`);
  };

  return (
    <ListItem onPress={handleChat}>
      <Avatar size="medium" source={{ uri: friend.friendPhotoURL }} rounded />
      <ListItem.Content>
        <ListItem.Title>{friend.friendDisplayName}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default ChatFriendListItem;

const styles = StyleSheet.create({});
