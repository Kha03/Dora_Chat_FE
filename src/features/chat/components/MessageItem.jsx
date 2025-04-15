/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Avatar from "@assets/chat/avatar.png";
import {
  AiOutlineDownload,
  AiOutlinePaperClip,
  AiOutlineEye,
} from "react-icons/ai";
import { MdError } from "react-icons/md";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageActionsMenu from "./MessageActionsMenu";

export default function MessageItem({ msg, showAvatar, showTime }) {
  dayjs.extend(relativeTime);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [hoverVideoUrl, setHoverVideoUrl] = useState("");
  const MAX_TEXT_LENGTH = 350;

  const isImage = msg.type === "IMAGE";
  const isFile = msg.type === "FILE";
  const isVideo = msg.type === "VIDEO";
  const isMe = msg.memberId?.userId === userId;
  const isDeleted = msg.isDeleted;

  useEffect(() => {
    if (!msg?.content) return; // Kiểm tra nếu msg.content không tồn tại
  
    try {
      const videoParts = msg.content.split("videos/");
      if (videoParts.length < 2) {
        throw new Error("Invalid video URL format");
      }
      
      const videoPath = videoParts[1];
      const videoIdParts = videoPath.split(".");
      if (videoIdParts.length === 0) {
        throw new Error("Invalid video file name");
      }
      
      const videoId = videoIdParts[0];
      const generatedThumbnailUrl = `https://res.cloudinary.com/dicvz8vw5/video/upload/so_1.0,f_jpg,w_500/videos/${videoId}.jpg`;
      const generatedHoverVideoUrl = msg.content.replace(
        "/upload/",
        "/upload/du_10,q_auto,w_500/"
      );
  
      setThumbnailUrl(generatedThumbnailUrl);
      setHoverVideoUrl(generatedHoverVideoUrl);
    } catch (error) {
      console.error("Error generating video URLs:", error);

      setThumbnailUrl(""); 
      setHoverVideoUrl(""); 
    }
  }, [msg?.content]);

  // Format file size if available
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Extract file name from URL or use provided fileName
  const getFileName = () => {
    if (msg.fileName) return msg.fileName;
    if (msg.content) {
      try {
        const url = new URL(msg.content);
        const pathSegments = url.pathname.split("/");
        return pathSegments[pathSegments.length - 1];
      } catch (e) {
        return "Tải xuống file";
      }
    }
    return "Tải xuống file";
  };

  // Handle image load events
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleVideoError = () => {
    setImageError(true);
  };

  // Reset image states if message changes
  useEffect(() => {
    setImageLoaded(true);
    setImageError(false);
    setVideoLoaded(true);
    setVideoError(false);
  }, [msg._id]);

  return (
    <div
      key={msg._id}
      className={`flex items-end gap-2 my-2 ${
        isMe ? "flex-row-reverse" : "justify-start"
      } group relative`}
    >
      {/* Avatar display logic */}
      {showAvatar ? (
        <img
          src={msg.memberId?.avatar || Avatar}
          alt="avatar"
          className="self-start w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full"></div>
      )}

      {/* Message content */}
      <div className="flex flex-col max-w-[468px] text-start relative">
        {/* Message actions menu button */}
        <div
          className={`absolute top-3 ${
            isMe ? "left-[-30px]" : "right-[-30px]"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        >
          {!isDeleted && (
            <MessageActionsMenu
              isMe={isMe}
              messageId={msg._id.toString()}
              conversationId={msg.conversationId.toString()}
              messageContent={msg.content}
              messageType={msg.type}
            />
          )}
        </div>

        {/* Message sender name (if not showing avatar and not from current user) */}
        {!showAvatar && !isMe && (
          <span className="text-xs font-medium text-gray-500 mb-1 ml-1">
            {msg.memberId?.name || "User"}
          </span>
        )}

        {/* Image message */}
        {isImage ? (
          <div className="relative">
            {!imageLoaded && !imageError && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center w-[300px] h-[200px]">
                <div className="animate-pulse">Đang tải ảnh...</div>
              </div>
            )}

            {imageError && (
              <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center w-[300px] h-[150px] p-4">
                <MdError size={32} className="text-red-500 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Không thể tải hình ảnh
                </p>
              </div>
            )}

            <img
              src={msg.content}
              alt="sent image"
              className={`max-w-[468px] max-h-[468px] object-contain rounded-lg ${
                imageLoaded ? "" : "hidden"
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => window.open(msg.content, "_blank")}
            />

            {imageLoaded && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <AiOutlineEye size={20} />
              </div>
            )}
          </div>
        ) : isVideo ? (
          <div className="relative">
            {!videoLoaded && !videoError && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center w-[300px] h-[200px]">
                <div className="animate-pulse">Đang tải video...</div>
              </div>
            )}

            {videoError && (
              <div className="bg-gray-100 rounded-lg flex flex-col items-center justify-center w-[300px] h-[150px] p-4">
                <MdError size={32} className="text-red-500 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  Không thể tải video
                </p>
              </div>
            )}

            {/* Container video */}
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsClicked(true)}
            >
              {/* Hiển thị thumbnail khi không hover và chưa click */}
              {!isClicked && !isHovered && thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                  alt="Image thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-thumbnail.jpg"; // Fallback nếu thumbnail lỗi
                  }}
                />
              )}

              {/* Hiển thị video hover khi hover và chưa click */}
              {!isClicked && isHovered && (
                <video
                  src={msg.content.replace(
                    "/upload/",
                    "/upload/du_10,q_auto,w_500/"
                  )}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg cursor-pointer"
                />
              )}

              {/* Hiển thị video đầy đủ khi click */}
              {isClicked && (
                <video
                  src={msg.content}
                  controls
                  className="max-w-[468px] max-h-[468px] object-contain rounded-lg"
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                />
              )}
            </div>
          </div>
        ) : isFile ? (
          /* File message */
          <div
            className={`px-3 py-[14px] rounded-2xl flex items-center gap-3 ${
              isMe ? "bg-[#EFF8FF]" : "bg-[#F5F5F5]"
            }`}
          >
            <div className="w-[60px] h-[60px] flex items-center justify-center bg-white rounded-md border border-gray-200">
              <AiOutlineDownload size={24} className="text-[#086DC0]" />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getFileName()}
              </p>
              {msg.fileSize && (
                <p className="text-xs text-gray-500">
                  {formatFileSize(msg.fileSize)}
                </p>
              )}

              {/* Download link */}
              <a
                href={msg.content}
                download={getFileName()}
                className="flex items-center text-[#086DC0] text-sm hover:underline mt-2"
              >
                <AiOutlinePaperClip size={16} className="mr-1" />
                Tải xuống
              </a>
            </div>
          </div>
        ) : (
          /* Text message */
          <div
            className={`px-3 py-[14px] rounded-2xl text-sm break-words w-full
            ${
              isDeleted
                ? "bg-gray-100 text-gray-400 italic"
                : isMe
                ? "bg-[#EFF8FF] text-[#000000]"
                : "bg-[#F5F5F5] text-[#000000]"
            }`}
          >
            {isDeleted ? (
              "Tin nhắn đã bị xóa"
            ) : (
              <>
                {expanded ? msg.content : msg.content.slice(0, MAX_TEXT_LENGTH)}
                {msg.content.length > MAX_TEXT_LENGTH && (
                  <span
                    className="text-[#086DC0] hover:underline ml-1 cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Message timestamp */}
        {showTime && (
          <span
            className={`text-xs text-[#959595F3] mt-1 ${
              isMe ? "self-end" : ""
            }`}
          >
            {dayjs(msg.createdAt).fromNow()}
          </span>
        )}
      </div>
    </div>
  );
}
