/* eslint-disable react/prop-types */
import Avatar from "@assets/chat/avatar.png";
import { AiOutlineClose, AiOutlinePaperClip } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect, useRef } from "react";
import MessageActionsMenu from "./MessageActionsMenu";
import VoteDisplay from "@/components/ui/vote-display";
import userApi from "../../../api/user";
import friendApi from "../../../api/friend";
import { useNavigate } from "react-router-dom";
import { REACT_ICONS } from "../../../utils/constant";
import { MapPin } from "lucide-react";
import LocationModal from "@/components/ui/location-modal";
import { DocViewerPlus } from "react-doc-viewer-plus";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function MessageItem({
  msg,
  showAvatar,
  showTime,
  onSelected,
  member,
  onSave,
  onLock,
  onReply,
  messages,
  handleScrollToMessage,
  setShowForwardModal,
  setForwardMessageData,
}) {
  dayjs.extend(relativeTime);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [previewImage, setPreviewImage] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverVideoUrl, setHoverVideoUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState(null); // Trạng thái hover cho reaction
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [visible, setVisible] = useState(false);

  const timeoutRef = useRef(null);

  const navigate = useNavigate();

  const MAX_TEXT_LENGTH = 350;

  const isMe =
    msg.memberId?.userId === undefined
      ? msg.userId === userId
      : msg.memberId?.userId === userId;
  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isVideo = msg.type === "VIDEO";
  const isNotify = msg.type === "NOTIFY";
  const isLink = msg.type === "TEXT" && msg.content.includes("http");
  const isVote = msg.type === "VOTE";
  const isLocation = msg.type === "LOCATION";
  const inviteLinkMatch = msg.content.match(
    /(https?:\/\/[^\s]+\/join\/[a-f0-9]+)/
  );
  useEffect(() => {
    if (!msg?.content) {
      console.warn("Video content is empty");
      setThumbnailUrl("");
      setHoverVideoUrl("");
      return;
    }

    try {
      // Tách public ID từ URL
      const uploadIndex = msg.content.indexOf("/upload/") + "/upload/".length;
      const publicIdWithExt = msg.content.slice(uploadIndex);
      const publicId = publicIdWithExt.split(".")[0];

      const baseUrl = msg.content.split("/upload/")[0] + "/upload/";
      const generatedThumbnailUrl = `${baseUrl}so_1.0,f_jpg,w_500/${publicId}.jpg`;
      const generatedHoverVideoUrl = `${baseUrl}du_10,q_auto,w_500/${publicIdWithExt}`;

      setThumbnailUrl(generatedThumbnailUrl);
      setHoverVideoUrl(generatedHoverVideoUrl);
    } catch (error) {
      console.warn("Video URL processing warning:", error.message);
      setThumbnailUrl("/placeholder-video-thumbnail.jpg");
      setHoverVideoUrl(msg.content);
    }
  }, [msg?.content]);

  const getFileTypeLabel = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return "Hình ảnh";
    if (["mp4", "mov", "avi", "webm"].includes(ext)) return "Video";
    if (["pdf"].includes(ext)) return "PDF";
    if (["doc", "docx"].includes(ext)) return "Word";
    if (["xls", "xlsx"].includes(ext)) return "Excel";
    if (["pptx", "ppt"].includes(ext)) return "Powerpoint";
    if (["zip", "rar", "7z"].includes(ext)) return "Lưu trữ";
    if (["mp3", "wav", "ogg", "m4a"].includes(ext)) return "Âm thanh";
    return "Tệp khác";
  };

  const handleHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleNonHover = () => {
    timeoutRef.current = setTimeout(() => {
      if (!menuOpen) setIsHovered(false);
    }, 400);
  };

  const handleTagClick = async (memberId) => {
    const userRes = await userApi.getByMemberId(memberId);
    const friendRes = await friendApi.isFriend(userId, userRes._id);
    const isFriend = friendRes === true ? true : friendRes.data;
    isFriend
      ? navigate("/friend-information", {
          state: {
            userData: userRes,
            isSentRequest: isFriend ? true : false,
          },
        })
      : navigate("/other-people-information", {
          state: {
            userData: userRes,
            isSentRequest: isFriend ? true : false,
          },
        });
  };
  // Tìm tin nhắn gốc từ replyMessageId
  const repliedMessage = msg.replyMessageId
    ? messages.find((m) => m._id === msg.replyMessageId)
    : null;
  // Hiển thị nội dung tin nhắn được reply
  const renderRepliedMessage = () => {
    if (!repliedMessage) return null;
    const isRepliedImage = repliedMessage.type === "IMAGE";
    const isRepliedVideo = repliedMessage.type === "VIDEO";
    const isRepliedFile = repliedMessage.type === "FILE";
    return (
      <div
        className="p-2 mb-1 bg-gray-100 rounded-lg cursor-pointer"
        onClick={() => handleScrollToMessage(repliedMessage._id)}
      >
        <span className="block text-xs font-medium text-gray-500">
          {repliedMessage.memberId?.name || "User"}
        </span>
        {isRepliedImage ? (
          <img
            src={repliedMessage.content}
            alt="Replied"
            className="max-w-[100px] max-h-[100px] object-contain rounded"
          />
        ) : isRepliedVideo ? (
          <video
            src={repliedMessage.content}
            className="max-w-[100px] max-h-[100px] object-contain rounded"
          />
        ) : isRepliedFile ? (
          <div className="flex items-center text-xs text-[#086DC0]">
            <AiOutlinePaperClip size={16} className="mr-1" />
            {repliedMessage.fileName || "File"}
          </div>
        ) : (
          <p className="text-xs text-gray-600 truncate">
            {repliedMessage.content}
          </p>
        )}
      </div>
    );
  };

  const truncateFileName = (fileName, maxLength = 40) => {
    if (!fileName) return "";
    return fileName.length > maxLength
      ? fileName.slice(0, maxLength) + "..."
      : fileName;
  };

  // Hiển thị reactions và tooltip khi hover
  const renderReactions = () => {
    if (!msg.reacts || msg.reacts.length === 0) return null;

    const reactionCounts = msg.reacts.reduce((acc, react) => {
      acc[react.type] = acc[react.type] || { count: 0, users: [] };
      acc[react.type].count += 1;
      acc[react.type].users.push(react.memberId.name);
      return acc;
    }, {});

    return (
      <div className="relative flex items-center gap-1 mt-1">
        {Object.entries(reactionCounts).map(([type, { count, users }]) => (
          <div
            key={type}
            className="relative"
            onMouseEnter={() => setHoveredReaction({ type, users })}
            onMouseLeave={() => setHoveredReaction(null)}
          >
            <span className="text-sm cursor-pointer">
              {REACT_ICONS[type]} {count > 1 ? count : ""}
            </span>
            {hoveredReaction?.type === type && (
              <div className="absolute bottom-full mb-1 bg-white border rounded-md shadow-md p-2 min-w-[150px] z-50 -left-10">
                {users.map((user, index) => (
                  <div key={index} className="text-sm">
                    {user} {REACT_ICONS[type]}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Add this function before the return statement
  const handleLocationClick = () => {
    if (isLocation && msg.location) {
      try {
        const lat = msg.location.lat;
        const lng = msg.location.lng;
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocationData({ lat, lng });
          setShowLocationModal(true);
        }
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
    }
  };

  return (
    <>
      {isVideo && hoverVideoUrl && (
        <video
          src={hoverVideoUrl}
          preload="auto"
          muted
          playsInline
          className="hidden"
        />
      )}
      {previewImage && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative">
            <div
              onClick={() => setPreviewImage(null)}
              className="absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer top-2 right-2 bg-black/50 hover:bg-black/70"
            >
              <AiOutlineClose className="text-lg text-white" />
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
      {isNotify ? (
        <div className="flex justify-center w-full my-4">
          <div className="bg-[#F0F2F5] text-xs text-gray-600 px-4 py-2 rounded-md shadow-sm italic">
            {msg.content}
          </div>
        </div>
      ) : (
        <div
          key={msg._id}
          className={`flex items-end gap-2 pt-1 pb-1 ${
            isMe ? "flex-row-reverse" : "justify-start"
          }  mb-4`}
        >
          {showAvatar ? (
            <img
              src={msg.memberId?.avatar || Avatar}
              alt="avatar"
              className="self-start w-10 h-10 ml-1 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full" />
          )}

          <div
            className="flex flex-col max-w-[468px] text-start relative
          group"
            onMouseEnter={handleHover}
            onMouseLeave={handleNonHover}
          >
            <div
              className={`absolute top-3 ${
                isMe ? "left-[-30px]" : "right-[-30px]"
              }`}
            >
              {!msg.isDeleted && (isHovered || menuOpen) && (
                <MessageActionsMenu
                  isMe={isMe}
                  messageId={msg._id.toString()}
                  conversationId={msg.conversationId.toString()}
                  message={msg}
                  type={msg.type}
                  isOpen={menuOpen}
                  setIsOpen={setMenuOpen}
                  onReply={onReply}
                  setShowForwardModal={setShowForwardModal}
                  setForwardMessageData={setForwardMessageData}
                />
              )}
            </div>

            {/* Message sender name (if not showing avatar and not from current user) */}
            {showAvatar && !isMe && (
              <span className="mb-1 ml-1 text-xs font-medium text-gray-500 ">
                {msg.memberId?.name || "User"}
              </span>
            )}
            {/* Hiển thị tin nhắn được reply */}
            {renderRepliedMessage()}
            {/* Message content */}
            {isImage ? (
              <img
                src={msg.content}
                alt="sent"
                className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                onClick={() => setPreviewImage(msg.content)}
              />
            ) : isVideo ? (
              isVideo && (
                <div
                  className="relative max-w-[468px] w-full h-auto"
                  onMouseEnter={handleHover}
                  onMouseLeave={handleNonHover}
                  onClick={() => setIsClicked(true)}
                >
                  {!isClicked ? (
                    <>
                      {/* Thumbnail và Video hover chồng lên nhau */}
                      <img
                        src={thumbnailUrl}
                        alt="thumbnail"
                        className={`w-full max-h-[468px] object-contain rounded-lg absolute top-0 left-0 transition-opacity duration-300 ${
                          isHovered ? "opacity-0" : "opacity-100"
                        }`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "fallback-thumbnail.jpg";
                        }}
                      />

                      <video
                        src={hoverVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`w-full max-h-[468px] object-contain rounded-lg absolute top-0 left-0 transition-opacity duration-300 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {/* Chiều cao giả để container không collapse */}
                      <div className="invisible">
                        <img
                          src={thumbnailUrl}
                          className="w-full max-h-[468px]"
                        />
                      </div>
                    </>
                  ) : (
                    <video
                      src={msg.content}
                      controls
                      className="w-full max-h-[468px] object-contain rounded-lg"
                    />
                  )}
                </div>
              )
            ) : isFile ? (
              <div className="px-3 py-[14px] rounded-2xl flex flex-col items-center gap-2 bg-[#EFF8FF]">
                <a
                  href={msg.content}
                  download
                  className="flex items-center text-[#086DC0] text-sm hover:underline"
                >
                  <AiOutlinePaperClip size={20} className="mr-1" />
                  {truncateFileName(msg.fileName || "Tải xuống file")}
                </a>

                {getFileTypeLabel(msg.content) === "Âm thanh" ? (
                  <AudioPlayer
                    src={msg.content}
                    controls
                    style={{ width: "100%" }}
                  />
                ) : (
                  <>
                    <button
                      onClick={() => setVisible(true)}
                      className="flex items-center text-[#086DC0] text-sm hover:underline"
                    >
                      {"Xem trước file"}
                    </button>

                    <DocViewerPlus
                      previewFile={{
                        fileUrl: msg.content,
                        fileName: msg.fileName || "File",
                      }}
                      visibleViewerPlus={visible}
                      onVisibleChange={() => setVisible(!visible)}
                    />
                  </>
                )}

                <span className="text-xs text-gray-500">
                  Loại: {getFileTypeLabel(msg.content)}
                </span>
              </div>
            ) : isVote ? (
              <div className="px-3 py-[14px] rounded-2xl bg-[#F5F5F5] text-[#000000] w-[430px]">
                <div className="mt-4">
                  <VoteDisplay
                    vote={msg}
                    onSelected={onSelected}
                    member={member}
                    onSave={onSave}
                    onLock={onLock}
                  />
                </div>
              </div>
            ) : isLocation ? (
              <div
                className="px-3 py-[14px] rounded-2xl bg-[#F5F5F5] text-[#000000] cursor-pointer hover:bg-[#EFF8FF] transition-colors"
                onClick={handleLocationClick}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Location</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Click to view shared location
                </div>
              </div>
            ) : inviteLinkMatch ? (
              <div>
                <p>{msg.content.replace(inviteLinkMatch[0], "").trim()}</p>
                <button
                  onClick={() => {
                    const fullUrl = inviteLinkMatch[0];
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const relativePath = fullUrl.replace(backendUrl, "");

                    navigate(relativePath, { replace: true });
                  }}
                  className="px-3 py-1 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Lời mời tham gia nhóm
                </button>
              </div>
            ) : (
              <p
                className={`px-3 py-[14px] rounded-2xl text-sm break-words w-full
            ${
              msg.isDeleted
                ? "bg-gray-100 text-gray-400 italic"
                : isMe
                ? "bg-[#EFF8FF] text-[#000000] ml-auto"
                : "bg-[#F5F5F5] text-[#000000]"
            }
            ${isLink ? "text-[#086DC0] hover:underline cursor-pointer" : ""}
              
`}
                onClick={() => {
                  if (isLink) {
                    window.open(msg.content, "_blank");
                  }
                }}
              >
                {msg.tags?.length > 0 &&
                msg.tagPositions?.length > 0 &&
                !msg.isDeleted
                  ? (() => {
                      const parts = [];
                      let lastIndex = 0;

                      msg.tagPositions.forEach((tagPos, index) => {
                        // Text bình thường trước tag (nếu có)
                        if (tagPos.start > lastIndex) {
                          parts.push(
                            <span key={`text-${index}`}>
                              {msg.content.slice(lastIndex, tagPos.start)}
                            </span>
                          );
                        }

                        // Tag highlight màu xanh + in đậm
                        parts.push(
                          <span
                            key={`tag-${index}`}
                            className="font-semibold text-blue-500 cursor-pointer hover:underline"
                            onClick={() => handleTagClick(tagPos.memberId)}
                          >
                            {msg.content.slice(tagPos.start, tagPos.end)}
                          </span>
                        );

                        // Cập nhật vị trí đã xử lý
                        lastIndex = tagPos.end;
                      });

                      // Text sau tag cuối cùng (nếu có)
                      if (lastIndex < msg.content.length) {
                        parts.push(
                          <span key="text-last">
                            {msg.content.slice(lastIndex)}
                          </span>
                        );
                      }

                      // Nếu vượt quá MAX_TEXT_LENGTH thì cắt & thêm "Xem thêm"
                      const fullText = parts
                        .map((part) => {
                          if (typeof part === "string") return part;
                          return part.props.children;
                        })
                        .join("");

                      if (!expanded && fullText.length > MAX_TEXT_LENGTH) {
                        const trimmedLength = MAX_TEXT_LENGTH;
                        const trimmedParts = [];
                        let currentLength = 0;

                        for (let part of parts) {
                          const partText =
                            typeof part === "string"
                              ? part
                              : part.props.children;
                          const remainingLength = trimmedLength - currentLength;

                          if (remainingLength <= 0) break;

                          if (partText.length <= remainingLength) {
                            trimmedParts.push(part);
                            currentLength += partText.length;
                          } else {
                            const trimmedText = partText.slice(
                              0,
                              remainingLength
                            );

                            if (typeof part === "string") {
                              trimmedParts.push(trimmedText);
                            } else {
                              trimmedParts.push(
                                <span
                                  key={`trimmed-${part.key}`}
                                  className={part.props.className}
                                >
                                  {trimmedText}
                                </span>
                              );
                            }

                            currentLength += remainingLength;
                            break;
                          }
                        }

                        return trimmedParts;
                      }

                      return parts;
                    })()
                  : expanded
                  ? msg.content
                  : msg.content.slice(0, MAX_TEXT_LENGTH)}

                {!msg.isDeleted && msg.content.length > MAX_TEXT_LENGTH && (
                  <span
                    className="text-[#086DC0] hover:underline ml-1 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Collapse" : "More"}
                  </span>
                )}
              </p>
            )}
            {/* Hiển thị reactions */}
            {renderReactions()}
            {showTime && (
              <span
                className={`text-xs text-[#959595F3] mt-2 ${
                  isMe ? "self-end" : ""
                }`}
              >
                {dayjs(msg.createdAt).fromNow()}
              </span>
            )}
          </div>
        </div>
      )}
      {showLocationModal && locationData && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSend={() => {}}
          initialLocation={locationData}
          position={locationData}
        />
      )}
    </>
  );
}
