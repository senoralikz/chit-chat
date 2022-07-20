// import { useRoute } from "@react-navigation/native";
// import { useToast } from "react-native-toast-notifications";

// const currentRoute = useRoute();
// const toast = useToast();

// export const newMessageAlert = (chats, user, chatId, currentRoute, toast) => {
//   if (
//     currentRoute.name !== "ChatScreen" ||
//     currentRoute.name !== "GroupChatScreen"
//   ) {
//     if (chats.length > 0 && chats[0].lastMessage?.sentBy !== user.uid) {
//       toast.show(chats[0].lastMessage?.message, {
//         type: "newMessage",
//         message: chats[0].lastMessage?.message,
//         displayName: chats[0].lastMessage?.senderDisplayName,
//         photoURL: chats[0].lastMessage?.senderPhotoURL,
//         createdAt: new Date(
//           chats[0].lastMessage?.createdAt * 1000
//         ).toLocaleTimeString("en-US", {
//           hour: "numeric",
//           minute: "numeric",
//           hour12: true,
//         }),
//         placement: "top",
//         duration: 5000,
//       });
//     }
//   } else {
//     if (chats.length > 0 && chats[0].groupId !== chatId) {
//       if (chats[0].lastMessage && chats[0].lastMessage?.sentBy !== user.uid) {
//         toast.show(chats[0].lastMessage?.message, {
//           type: "newMessage",
//           message: chats[0].lastMessage?.message,
//           displayName: chats[0].lastMessage?.senderDisplayName,
//           photoURL: chats[0].lastMessage?.senderPhotoURL,
//           placement: "top",
//           duration: 5000,
//         });
//       }
//     }
//   }
// };
