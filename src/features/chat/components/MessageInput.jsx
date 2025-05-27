/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PictureIcon from "@assets/chat/picture_icon.svg";
import PauseIcon from "@assets/chat/pause.svg";
import MicroIcon from "@assets/chat/micro.svg";

import PlayIcon from "@assets/chat/play.svg";
import StopIcon from "@assets/chat/stop.svg";
import EmojiIcon from "@assets/chat/emoji_icon.svg";
import SendIcon from "@assets/chat/send_icon.svg";
import EmojiPicker from "emoji-picker-react"; // dùng thư viện emoji-picker-react
import MoreMessageDropdown from "@/components/ui/more-message-dropdown";
import { AlertMessage } from "@/components/ui/alert-message";
import { AiOutlineClose, AiOutlinePaperClip } from "react-icons/ai";
import convertWebmToMp3 from "../../../utils/convertFile";
export default function MessageInput({
  conversation,
  onSend,
  isMember,
  setIsVoteModalOpen,
  isGroup,
  members,
  member,
  onReply,
  replyMessage,
  isLoading = false,
}) {
  const [input, setInput] = useState("");
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(null);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [file, setFile] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //audio
  const [mediaRecorder, setMediaRecorder] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [recordingTimer, setRecordingTimer] = useState(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const editableRef = useRef(null); // dùng để thao tác con trỏ input
  const inputContainerRef = useRef(null);

  const [inputMode, setInputMode] = useState("normal"); // "normal" o "restricted"
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (editableRef.current?.innerText.trim() === "") {
      editableRef.current.classList.add("show-placeholder");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isMember !== undefined) {
      const newMode = isMember ? "normal" : "restricted";

      if (newMode !== inputMode) {
        setIsTransitioning(true);

        setTimeout(() => {
          setInputMode(newMode);
          setIsTransitioning(false);
        }, 150);
      }
    }
  }, [isMember, isLoading, inputMode]);
  // Hàm format thời gian
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Hàm bắt đầu timer
  const startTimer = () => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor(
        (now - recordingStartTime - totalPausedTime) / 1000
      );
      setRecordingTime(formatTime(elapsed));
    }, 1000);
    setRecordingTimer(timer);
  };

  // Hàm dừng timer
  const stopTimer = () => {
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
  };
  // Cập nhật hàm startRecording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const webmBlob = new Blob(chunks, { type: "audio/webm" });
        const mp3File = await convertWebmToMp3(webmBlob);
        setIsMessageLoading(true);
        try {
          await onSend({
            type: "FILE",
            files: [mp3File],
            replyMessageId: replyMessage?.messageId,
          });
        } catch (e) {
          console.error("Send error", e);
        } finally {
          setIsMessageLoading(false);
        }
        // Reset states
        setIsRecording(false);
        setIsPaused(false);
        setAudioChunks([]);
        setRecordingTime("00:00");
        setRecordingStartTime(null);
        setTotalPausedTime(0);
        setPauseStartTime(null);
        stopTimer();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);

      // Khởi tạo timer
      const now = Date.now();
      setRecordingStartTime(now);
      setTotalPausedTime(0);
      setRecordingTime("00:00");
      startTimer();

      // Auto stop sau 60 giây
      const timeout = setTimeout(() => stopRecording(), 60000);
      setRecordingTimeout(timeout);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  // Cập nhật hàm pauseRecording
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setPauseStartTime(Date.now());
      stopTimer();
      setIsPaused(true);
    }
  };

  // Cập nhật hàm resumeRecording
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();

      // Cộng thời gian đã pause vào tổng thời gian pause
      const pauseDuration = Date.now() - pauseStartTime;
      setTotalPausedTime((prev) => prev + pauseDuration);
      setPauseStartTime(null);

      startTimer();
      setIsPaused(false);
    }
  };

  // Cập nhật hàm stopRecording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      clearTimeout(recordingTimeout);
      stopTimer();
    }
  };

  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
      }
    };
  }, [recordingTimer, recordingTimeout]);

  const filteredMembers =
    members && Array.isArray(members)
      ? members
          .filter((m) => m._id.toString() !== (member?._id?.toString() || ""))
          .filter((m) =>
            m.name.toLowerCase().includes(mentionQuery.toLowerCase())
          )
      : [];

  useEffect(() => {
    if (imageFiles.length > 0) {
      const previews = imageFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [imageFiles]);

  useEffect(() => {
    if (videoFiles.length > 0) {
      const previews = videoFiles.map((file) => URL.createObjectURL(file));
      setVideoPreviews(previews);
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [videoFiles]);

  useEffect(() => {
    if (file) {
      const filePreview = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      };
      setFilePreviews([filePreview]);
    } else {
      setFilePreviews([]);
    }
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleImageOrVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    // nếu file là ảnh
    if (files.some((file) => file.type.startsWith("image/"))) {
      setImageFiles(files);
    }
    // nếu file là video
    else if (files.some((file) => file.type.startsWith("video/"))) {
      setVideoFiles(files);
    }
  };

  const handleFileSelect = (file) => {
    setFile(file);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = () => {
    setFile(null);
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (
      !editableRef.current?.innerText.trim() &&
      !imageFiles.length &&
      !file &&
      !videoFiles.length
    )
      return;

    setIsMessageLoading(true);
    try {
      const plainText = editableRef.current?.innerText || "";

      const tags = [];
      const tagPositions = [];

      if (editableRef.current) {
        const spans = editableRef.current.querySelectorAll(".mention");

        spans.forEach((span) => {
          const memberName = span.textContent.replace(/^@/, "").trim();

          const foundMember = members.find(
            (m) =>
              m.name.trim().toLowerCase() === memberName.toLowerCase() &&
              m._id.toString() !== member._id.toString()
          );

          if (foundMember) {
            tags.push(foundMember._id);

            // Tính vị trí start/end dựa trên plainText
            const plainText = editableRef.current.innerText;
            const mentionText = span.innerText;
            const start = plainText.indexOf(mentionText);
            const end = start + mentionText.length;

            tagPositions.push({
              memberId: foundMember._id,
              start,
              end,
              name: foundMember.name,
            });
          }
        });
      }

      if (plainText.trim()) {
        await onSend({
          content: plainText.trim(),
          type: "TEXT",
          tags,
          tagPositions,
          replyMessageId: replyMessage?.messageId,
        });
      }

      if (imageFiles.length > 0) {
        await onSend({
          type: "IMAGE",
          files: imageFiles,
          replyMessageId: replyMessage?.messageId,
        });
      }

      if (videoFiles.length > 0) {
        await onSend({
          type: "VIDEO",
          files: videoFiles,
          replyMessageId: replyMessage?.messageId,
        });
      }

      if (file) {
        await onSend({
          type: "FILE",
          files: [file],
          replyMessageId: replyMessage?.messageId,
        });
      }

      setImageFiles([]);
      setVideoFiles([]);
      setImagePreviews([]);
      setVideoPreviews([]);
      setFile(null);
      setFilePreviews([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Clear the input field
      if (editableRef.current) {
        editableRef.current.innerHTML = "";
        editableRef.current.classList.add("show-placeholder");
      }
      setInput("");
      onReply(null);
    } catch (error) {
      console.error("Send message error:", error);
      AlertMessage({
        type: "error",
        message: "Send message error!",
      });
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !showMentionDropdown) {
      e.preventDefault();
      handleSend();
    }

    // Xử lý navigation trong dropdown mention
    if (showMentionDropdown && conversation?.type) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          Math.min(prev + 1, filteredMembers.length - 1)
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredMembers[selectedMentionIndex]) {
          handleSelectMention(filteredMembers[selectedMentionIndex]);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDropdown(false);
        return;
      }
    }
  };

  const onEmojiClick = (emojiData) => {
    if (!editableRef.current) return;

    const selection = window.getSelection();
    let range;

    // Nếu không có selection hoặc selection không trong editableRef
    if (
      !selection.rangeCount ||
      !editableRef.current.contains(selection.anchorNode)
    ) {
      // Tạo range mới ở cuối editableRef
      editableRef.current.focus();
      range = document.createRange();
      range.selectNodeContents(editableRef.current);
      range.collapse(false); // collapse to end
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      range = selection.getRangeAt(0);
    }

    // Chèn emoji
    const emojiNode = document.createTextNode(emojiData.emoji);
    range.deleteContents();
    range.insertNode(emojiNode);

    // Di chuyển cursor sau emoji
    const newRange = document.createRange();
    newRange.setStartAfter(emojiNode);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);

    setInput(editableRef.current.innerText);

    setShowEmojiPicker(false);

    // Đảm bảo div vẫn giữ focus
    editableRef.current.focus();
  };

  const handleInputChange = () => {
    if (conversation?.type) {
      // Xử lý khi gõ bên trong một mention span
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      let node = range.startContainer;

      // Kiểm tra xem có đang gõ bên trong mention span không
      let insideMentionSpan = false;
      let mentionSpan = null;

      while (node && node !== editableRef.current) {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.classList.contains("mention")
        ) {
          insideMentionSpan = true;
          mentionSpan = node;
          break;
        }
        node = node.parentNode;
      }

      if (insideMentionSpan && mentionSpan) {
        // Nếu đang gõ trong mention span, xử lý để phá vỡ mention
        // Tạo một text node mới từ nội dung hiện tại của span
        const textNode = document.createTextNode(mentionSpan.textContent);

        // Thay thế span cũ bằng text node mới
        mentionSpan.parentNode.replaceChild(textNode, mentionSpan);

        // Đặt lại con trỏ vào vị trí trong text node
        const newRange = document.createRange();
        newRange.setStart(textNode, range.startOffset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        setInput(editableRef.current.innerText);
        return;
      }

      if (!editableRef.current) return;

      setInput(editableRef.current.innerText);

      const text = editableRef.current.innerText || "";

      // Xử lý cho việc mention
      const cursorPos = getCursorPosition(editableRef.current);

      const textBeforeCursor = text.substring(0, cursorPos);
      const lastAtPos = textBeforeCursor.lastIndexOf("@");

      if (
        lastAtPos >= 0 &&
        /^[\w\s]*$/.test(textBeforeCursor.substring(lastAtPos + 1))
      ) {
        const query = textBeforeCursor.substring(lastAtPos + 1);
        const matchedMembers = members
          .filter((m) => m._id.toString() !== member._id.toString())
          .filter((m) =>
            m.name.toLowerCase().includes(query.trim().toLowerCase())
          );

        setMentionQuery(query);

        if (matchedMembers.length > 0) {
          setShowMentionDropdown(true);
          setMentionPosition({
            start: lastAtPos,
            end: cursorPos,
          });
          setSelectedMentionIndex(0);
        } else {
          setShowMentionDropdown(false);
        }
      } else {
        setShowMentionDropdown(false);
      }
    }
    setInput(editableRef.current.innerText);
  };

  // Helper để lấy vị trí con trỏ hiện tại
  const getCursorPosition = (element) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return 0;

    const range = selection.getRangeAt(0);
    const node = selection.anchorNode;

    let cursorPos = 0;

    const traverse = (currentNode) => {
      if (currentNode === node) {
        cursorPos += range.startOffset;
        throw cursorPos;
      }

      if (currentNode.nodeType === Node.TEXT_NODE) {
        cursorPos += currentNode.textContent.length;
      }

      currentNode.childNodes.forEach(traverse);
    };

    try {
      traverse(element);
    } catch (result) {
      cursorPos = result;
    }

    return cursorPos;
  };

  const handleSelectMention = (selectedMember) => {
    if (conversation?.type) {
      if (!mentionPosition || !editableRef.current) {
        setShowMentionDropdown(false);
        return;
      }

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = document.createRange();
      let charIndex = 0;
      let found = false;

      const traverseNodes = (node) => {
        if (found) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharIndex = charIndex + node.textContent.length;

          if (
            mentionPosition.start >= charIndex &&
            mentionPosition.end <= nextCharIndex
          ) {
            const startOffset = mentionPosition.start - charIndex;
            const endOffset = mentionPosition.end - charIndex;

            range.setStart(node, startOffset);
            range.setEnd(node, endOffset);

            found = true;
            return;
          }

          charIndex = nextCharIndex;
        } else {
          node.childNodes.forEach(traverseNodes);
        }
      };

      traverseNodes(editableRef.current);

      if (!found) {
        console.error("Failed to locate mention position");
        return;
      }

      const span = document.createElement("span");
      span.style.color = "#1a73e8";
      span.className = "mention";
      span.textContent = `@${selectedMember.name}`;
      span.setAttribute("contenteditable", "false"); // Ngăn chặn việc chỉnh sửa trực tiếp
      range.deleteContents();
      range.insertNode(span);

      // Thêm một khoảng trắng sau đó
      const spaceNode = document.createTextNode(" ");
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      newRange.insertNode(spaceNode);

      // Di chuyển con trỏ sau khoảng trắng vừa thêm
      newRange.setStartAfter(spaceNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      setShowMentionDropdown(false);
      setMentionQuery("");
      setMentionPosition(null);

      setInput(editableRef.current.innerText);
    }
  };

  const handleLocationSelect = (location) => {
    onSend({
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      type: "LOCATION",
    });
  };

  // Hiển thị tin nhắn đang reply
  const renderReplyPreview = () => {
    if (!replyMessage) return null;
    const isRepliedImage = replyMessage.type === "IMAGE";
    const isRepliedVideo = replyMessage.type === "VIDEO";
    const isRepliedFile = replyMessage.type === "FILE";
    return (
      <div className="flex items-center justify-between p-2 mx-3 bg-gray-100 border-t border-gray-200 rounded-t-lg">
        <div>
          <span className="block text-xs font-medium text-gray-500">
            Replying to {replyMessage.member || "User"}
          </span>
          {isRepliedImage ? (
            <img
              src={replyMessage.content}
              alt="Replied"
              className="max-w-[50px] max-h-[50px] object-contain rounded"
            />
          ) : isRepliedVideo ? (
            <video
              src={replyMessage.content}
              className="max-w-[50px] max-h-[50px] object-contain rounded"
            />
          ) : isRepliedFile ? (
            <div className="flex items-center text-xs text-[#086DC0]">
              <AiOutlinePaperClip size={16} className="mr-1" />
              {replyMessage.fileName || "File"}
            </div>
          ) : (
            <p className="text-xs text-left text-gray-600 truncate">
              {replyMessage.content}
            </p>
          )}
        </div>
        <button
          onClick={() => onReply(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose size={16} />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="relative flex flex-col w-full">
        <div className="flex items-center p-3 border-t">
          <div className="flex-1 flex h-12 border rounded-[32px] items-center bg-[#F6F6F6] px-4 relative">
            <div className="w-full text-sm text-center text-gray-400">
              Loading conversation...
            </div>
          </div>
          <div className="px-4 py-2 ml-1 opacity-50">
            <img src={SendIcon} alt="Send" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full">
      {/* Hiển thị tin nhắn đang reply */}
      {renderReplyPreview()}

      {/* Recording Status Bar - Hiển thị khi đang ghi âm */}
      {isRecording && (
        <div className="flex items-center justify-between p-3 mx-3 mb-2 border border-red-200 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full opacity-30 animate-ping"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-red-700">
                {isPaused ? "Recording Paused" : "Recording..."}
              </span>
              <span className="text-xs text-red-500">{recordingTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-red-400 rounded-full animate-bounce`}
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Previews (chỉ hiển thị 1 trong 2: image hoặc video) */}
      {(imagePreviews.length > 0 ||
        videoPreviews.length > 0 ||
        filePreviews.length > 0) && (
        <div className="p-2 mx-3 border-t border-gray-200">
          {/* Hiển thị image previews nếu có */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị video previews nếu có */}
          {videoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <video
                    src={preview}
                    controls
                    className="object-cover w-16 h-16 rounded"
                  />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị file preview nếu có */}
          {filePreviews.length > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center">
                <div className="mr-2">📄</div>
                <div>
                  <div className="max-w-xs text-sm font-medium truncate">
                    {filePreviews[0].name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {filePreviews[0].size}
                  </div>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="light" />
        </div>
      )}

      {/* Mention Dropdown */}
      {showMentionDropdown && filteredMembers.length > 0 && (
        <div
          className="absolute bottom-[70px] left-4 z-10 w-64 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
          style={{
            left: mentionPosition ? `${mentionPosition.start * 8}px` : "0",
          }}
        >
          {filteredMembers.length === 0 ? (
            <div className="p-2 text-gray-500">No members to mention</div>
          ) : (
            filteredMembers.map((member, index) => (
              <div
                key={member._id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedMentionIndex === index ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectMention(member)}
              >
                <div className="flex items-center">
                  <div className="mr-2">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full"
                        style={{
                          backgroundColor: member.avatarColor || "#ccc",
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center p-3 border-t">
        {inputMode === "normal" && !isRecording && (
          <>
            <Button
              size="icon"
              className="mr-3 text-white transition-all duration-200 border-none rounded-full shrink-0 bg-regal-blue hover:scale-105 hover:bg-regal-blue/80 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Plus className="!h-6 !w-6" />
            </Button>
            <MoreMessageDropdown
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onFileSelect={handleFileSelect}
              setIsVoteModalOpen={setIsVoteModalOpen}
              isGroup={isGroup}
              onLocationSelect={handleLocationSelect}
            />
          </>
        )}

        {/* Input Container - Ẩn khi đang ghi âm */}
        <div
          ref={inputContainerRef}
          className={`flex-1 flex h-12 border rounded-[32px] items-center bg-[#F6F6F6] px-4 relative
           focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300
           transition-all duration-300 ${
             isTransitioning ? "opacity-0" : "opacity-100"
           } ${isRecording ? "opacity-50 pointer-events-none" : ""}`}
        >
          {inputMode === "restricted" ? (
            <input
              type="text"
              placeholder="You cannot message this conversation"
              className="w-full text-sm italic outline-none bg-inherit placeholder:text-center"
              disabled={true}
            />
          ) : (
            <>
              <div className="relative w-full">
                {/* Placeholder giả */}
                {input.trim() === "" && !isRecording && (
                  <div className="absolute text-sm text-gray-400 -translate-y-1/2 pointer-events-none select-none left-4 top-1/2">
                    {isRecording
                      ? "Recording in progress..."
                      : "Type a message..."}
                  </div>
                )}

                <div
                  ref={editableRef}
                  contentEditable={!isRecording}
                  onInput={handleInputChange}
                  onKeyDown={handleKeyDown}
                  suppressContentEditableWarning={true}
                  className="w-full py-2 ml-4 text-sm text-left outline-none bg-inherit show-placeholder"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    minHeight: "24px",
                  }}
                />
              </div>

              {!isRecording && (
                <>
                  <label className="cursor-pointer hover:opacity-70">
                    <img src={PictureIcon} className="p-2" alt="Picture" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      multiple
                      ref={imageInputRef}
                      onChange={handleImageOrVideoSelect}
                      disabled={isMessageLoading}
                    />
                  </label>
                  <button
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="px-2 bg-inherit hover:border-transparent hover:opacity-70"
                  >
                    <img src={EmojiIcon} alt="Emoji" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Recording Controls */}
        {inputMode === "normal" && (
          <div className="flex items-center gap-2 ml-3">
            {!isRecording ? (
              <div
                onClick={startRecording}
                className="relative flex items-center justify-center w-8 h-8 transition-all duration-200 transform rounded-full shadow-lg cursor-pointer group bg-gradient-to-r from-red-500 to-red-600 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                <img
                  src={MicroIcon}
                  alt="Start Recording"
                  className="w-5 h-5"
                />

                <div className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded opacity-0 -top-10 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                  Start Recording
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isPaused ? (
                  <div
                    onClick={resumeRecording}
                    className="relative flex items-center justify-center w-8 h-8 transition-all duration-200 transform rounded-full shadow-md cursor-pointer group bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
                  >
                    <img src={PlayIcon} alt="Resume" />
                    <div
                      className={`absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded opacity-0 -top-10 left-1/2 group-hover:opacity-100 whitespace-nowrap
                      ${
                        isMessageLoading
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : ""
                      }`}
                    >
                      Resume
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={pauseRecording}
                    className={`relative flex items-center justify-center w-8 h-8 transition-all duration-200 transform rounded-full shadow-md cursor-pointer group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-200
                      ${
                        isMessageLoading
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : ""
                      }`}
                  >
                    <img src={PauseIcon} alt="Pause" />
                    <div className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded opacity-0 -top-10 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                      Pause
                    </div>
                  </div>
                )}

                <div
                  onClick={stopRecording}
                  className={`relative flex items-center justify-center w-8 h-8 transition-all duration-200 transform rounded-full shadow-md cursor-pointer group bg-gradient-to-r from-blue-400 to-blue-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                    isMessageLoading
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : ""
                  }}`}
                >
                  <img src={StopIcon} alt="Stop" />
                  <div className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-black rounded opacity-0 -top-10 left-1/2 group-hover:opacity-100 whitespace-nowrap">
                    Stop & Send
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send Button - Ẩn khi đang ghi âm */}
        {inputMode === "normal" && !isRecording && (
          <div
            onClick={!isMessageLoading ? handleSend : undefined}
            className={`px-4 py-2 ml-1 duration-200 ease-in-out hover:translate-x-2 cursor-pointer${
              isMessageLoading
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
          >
            <img src={SendIcon} alt="Send" />
          </div>
        )}
      </div>
    </div>
  );
}
