import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ListItem, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

const ContactListItem = ({ contact, navigation }) => {
  return (
    <ListItem bottomDivider>
      <Avatar size="medium" source={{ uri: contact.friendPhotoURL }} rounded />
      <ListItem.Content
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <ListItem.Title>{contact.friendDisplayName}</ListItem.Title>
        <Pressable
          onPress={() =>
            Alert.alert(
              "El Bochinche",
              `You are gossiping with ${contact.friendDisplayName}`,
              { text: "Ok" }
            )
          }
        >
          <Ionicons name="chatbubble" size={24} color="#9b59b6" />
        </Pressable>
      </ListItem.Content>
    </ListItem>
  );
};

export default ContactListItem;

const styles = StyleSheet.create({});
