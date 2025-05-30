/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ContactCardDropdown from "@/components/ui/Contact/ContactCardDropdown";
import GroupCardDropdown from "@/components/ui/Contact/GroupCardDropdown";
import Avatar from "@assets/chat/avatar.png";
import friendApi from "../../api/friend";
import dayjs from "dayjs";

export const Conversation = memo(function Conversation({
  onClick,
  idUser,
  isActive,
  activeTab,
  members,
  name,
  avatar,
  lastMessageId,
  id,
  unread,
  type,
}) {
  const [isConversationHovered, setIsConversationHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("");
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const formatTimeDifference = useCallback(() => {
    if (!lastMessageId?.createdAt) {
      return "";
    }

    const messageDate = dayjs(lastMessageId.createdAt);
    const now = dayjs();
    const diffMinutes = now.diff(messageDate, "minute");
    const diffHours = now.diff(messageDate, "hour");
    const diffDays = now.diff(messageDate, "day");

    // Format based on how old the message is
    if (diffMinutes < 1) {
      return "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return messageDate.format("MM/DD");
    }
  }, [lastMessageId?.createdAt]);

  useEffect(() => {
    // Initial update
    setTimeDisplay(formatTimeDifference());

    // Set up interval for continuous updates
    intervalRef.current = setInterval(() => {
      setTimeDisplay(formatTimeDifference());
    }, 60000); // Update every minute

    // Clean up interval on unmount or when lastMessageId changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [formatTimeDifference]);

  const showDropdown = isConversationHovered || isDropdownHovered;

  const partner = name || members?.filter((member) => member.userId !== idUser);

  const handleConversationEnter = () => {
    setIsConversationHovered(true);
  };

  const handleConversationLeave = () => {
    setTimeout(() => {
      if (!isDropdownHovered) {
        setIsConversationHovered(false);
      }
    }, 100);
  };

  const handleDropdownEnter = () => {
    setIsDropdownHovered(true);
  };

  const handleDropdownLeave = () => {
    setIsDropdownHovered(false);
    if (!isConversationHovered) {
      setIsConversationHovered(false);
    }
  };

  const handleViewInfo = useCallback(async () => {
    const partData = {
      _id: partner[0].userId,
      name: partner[0].name,
      avatar: partner[0].avatar,
      coverImage: partner[0].coverImage,
    };
    const friendRes = await friendApi.isFriend(
      JSON.parse(localStorage.getItem("user"))?._id,
      partData._id
    );
    const isFriend = friendRes === true ? true : friendRes.data;

    if (isFriend) {
      navigate("/friend-information", {
        state: {
          userData: partData,
        },
      });
    } else {
      navigate("/other-people-information", {
        state: {
          userData: partData,
        },
      });
    }
  }, [partner, navigate]);

  const handleClick = useCallback(
    (e) => {
      if (isDropdownHovered) {
        return;
      }

      if (onClick) {
        onClick(e);
      } else if (id) {
        // If no onClick provided but we have an ID, navigate to chat
        navigate(`/chat/${id}`);
      }
    },
    [onClick, id, isDropdownHovered, navigate]
  );

  return (
    <div className="relative">
      <div
        className={`h-15 flex items-center gap-3 p-3 rounded-2xl cursor-pointer relative ${isActive ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
        onClick={handleClick}
        onMouseEnter={handleConversationEnter}
        onMouseLeave={handleConversationLeave}
      >
        {type ? (
          <img
            src={avatar || Avatar}
            alt={name}
            className="object-cover rounded-full w-14 h-14"
          />
        ) : (
          <img
            src={partner[0].avatar || Avatar}
            alt={name}
            className="object-cover rounded-full w-14 h-14"
          />
        )}
        <div className="flex-1 min-w-0 pl-3">
          <div className="relative flex items-center justify-between">
            <h3 className="text-sm font-medium text-left truncate">
              {type ? name : partner[0].name}
            </h3>
            {unread > 0 && (
              <span className="absolute top-0 -left-10 ml-2 min-w-[20px] h-[20px] px-1 flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full shadow">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
          <p className="text-sm text-left text-gray-500 truncate">
            {lastMessageId?.content}
          </p>
        </div>

        {!showDropdown && (
          <span className="text-sm text-gray-400">{timeDisplay}</span>
        )}

        {showDropdown && (
          <div
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            {activeTab === "messages" ? (
              <ContactCardDropdown
                onViewInfo={handleViewInfo}
                onSetNickname={() => console.log("Set nickname")}
                onDelete={() => console.log("Delete contact")}
              />
            ) : (
              <GroupCardDropdown
                onViewInfo={() => console.log("View info")}
                onLeaveGroup={() => console.log(" ")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
