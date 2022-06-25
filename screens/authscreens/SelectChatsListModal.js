import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import ChatListItem from "../../components/ChatListItem.js";

const SelectChatsListModal = ({
  modalVisible,
  setModalVisible,
  chatWith,
  groups,
  navigation,
}) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={{ justifyContent: "center" }}
        onPress={() => setModalVisible(false)}
      >
        <Ionicons name="chevron-back" size={32} color="#9b59b6" />
      </Pressable>
      <View
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 10 }}
      >
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <ChatListItem chat={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.groupId}
          ListEmptyComponent={() => <Button title="Create New Chat" />}
        />
      </View>
      <StatusBar style="inverted" />
    </Modal>
  );
};

export default SelectChatsListModal;

const styles = StyleSheet.create({});
