import messageApi from "@/api/message";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  markRead,
  setActiveConversation,
  setMessages,
} from "../../features/chat/chatSlice";
import ChatBox from "./components/ChatBox";
import DetailChat from "./components/DetailChat";
import HeaderSignleChat from "./components/HeaderSignleChat";
import MessageInput from "./components/MessageInput";
export default function ChatSingle() {
  const { id: conversationId } = useParams();
  const dispatch = useDispatch();
  const { messages, unread } = useSelector((state) => state.chat);
  const conversationMessages = messages[conversationId] || [];

  useEffect(() => {
    dispatch(setActiveConversation(conversationId)); // Đặt cuộc trò chuyện đang mở
    console.log("Conversation ID:", conversationId);
    // Lấy tin nhắn ban đầu
    messageApi
      .fetchMessages(conversationId)
      .then((res) => {
        dispatch(setMessages({ conversationId, messages: res }));
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    // Đánh dấu đã đọc
    if (unread[conversationId] > 0) {
      dispatch(markRead({ conversationId }));
    }
  }, [conversationId, dispatch, unread]);

  const handleSendMessage = async ({ content, type, files }) => {
    try {
      if (type === "TEXT") {
        await messageApi.sendTextMessage({ conversationId, content });
      } else if (type === "IMAGE") {
        await messageApi.sendImageMessage(conversationId, files);
      } else if (type === "FILE") {
        await messageApi.sendFileMessage(conversationId, files[0]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="flex w-full h-screen">
      {/* Main Content */}
      <div className="flex flex-1 overflow-auto ">
        {/* ChatBox  */}
        <div className="flex flex-col flex-1 bg-gradient-to-b from-blue-50/50 to-white">
          <HeaderSignleChat handleDetail={setShowDetail} />
          <ChatBox messages={conversationMessages} />
          <MessageInput onSend={handleSendMessage} />
        </div>

        {/* DetailChat*/}
        <div
          className={`bg-white shadow-xl transition-all duration-200 my-3 rounded-[20px]  ${showDetail ? "w-[385px]" : "w-0"
            }`}
        >
          {showDetail && <DetailChat />}
        </div>
      </div>
    </div>
  );
}
