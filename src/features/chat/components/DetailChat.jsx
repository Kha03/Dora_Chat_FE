/* eslint-disable react/prop-types */

import { useState } from "react";
import MainDetail from "./MainDetail";
import MediaDetail from "./detail_chat/MediaDetail";
import MemberList from "./detail_chat/MemberList";
import PinList from "./detail_chat/PinList";
import RequestList from "./detail_chat/RequestList";
export default function DetailChat({
  conversation,
  imagesVideos,
  files,
  links,
  pinMessages,
  onScrollToMessage,
}) {
  const [activeTab, setActiveTab] = useState({
    tab: "detail",
  });
  const handleSetActiveTab = (tab) => {
    setActiveTab((prev) => ({
      ...prev,
      ...tab,
    }));
  };
  return (
    <div className="h-full w-[385px] p-4 bg-[#E8F4FF] rounded-[20px]">
      {activeTab.tab === "detail" && (
        <MainDetail
          handleSetActiveTab={handleSetActiveTab}
          conversation={conversation}
          imagesVideos={imagesVideos}
          files={files}
          links={links}
          pinMessages={pinMessages}
        />
      )}
      {activeTab.tab === "members" && (
        <MemberList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          conversationId={conversation._id}
          managers={conversation?.managerIds}
          leader={conversation?.leaderId}
        />
      )}
      {activeTab.tab === "request" && (
        <RequestList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          conversationId={conversation._id}
          managers={conversation?.managerIds}
          leader={conversation?.leaderId}
        />
      )}
      {activeTab.tab === "pins" && (
        <PinList
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          pinMessages={pinMessages}
          onScrollToMessage={onScrollToMessage}
        />
      )}
      {activeTab.tab === "media" && (
        <MediaDetail
          onBack={() =>
            setActiveTab((prev) => ({
              ...prev,
              tab: "detail",
            }))
          }
          media={activeTab?.media}
          imagesVideos={imagesVideos}
          files={files}
          links={links}
        />
      )}
    </div>
  );
}
