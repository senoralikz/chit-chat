import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { CheckBox } from "react-native-elements";

const ContactListItem = ({
  friend,
  chatWith,
  setChatWith,
  selectingChatters,
}) => {
  const [checked, setChecked] = useState(friend.chattingWith);

  useEffect(() => {
    // selectingChatters(friend, checked);

    if (checked) {
      friend.chattingWith = true;
      let chatters = chatWith;
      // chatters.push(friend);
      console.log("chatting with these people", chatters);
      {
        !chatters.some((chatter) => chatter.userId === friend.userId) &&
          chatters.push(friend);
      }

      setChatWith(chatters);
    } else {
      friend.chattingWith = false;
      let chatters = chatWith.filter((chatter) => {
        if (chatter.userId !== friend.userId) {
          return chatter;
        }
      });
      // console.log("chatting with these people", chatters);
      setChatWith(chatters);
    }
  }, [checked]);

  return (
    <ListItem>
      <Avatar size="medium" source={{ uri: friend.photoURL }} rounded />
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
            {friend.displayName}
          </ListItem.Title>
          <CheckBox
            // center
            checked={checked}
            checkedColor="#9b59b6"
            onPress={() => setChecked(!checked)}
          />
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({});
