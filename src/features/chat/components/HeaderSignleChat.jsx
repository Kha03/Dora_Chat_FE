/* eslint-disable react/prop-types */
import DetailChatIcon from "@assets/chat/detail_chat.svg";
import VideoCall from "@assets/chat/video_call.svg";
import Call from "@assets/chat/call.svg";
import Avatar from "@assets/chat/avatar.png";

export default function HeaderSignleChat({ handleDetail }) {
  return (
    <div>
      <div className="flex items-center px-4 pt-5 pb-1 border-b">
        <img
          src={Avatar}
          className="w-[70px] h-[70px] object-cover rounded-full"
        />
        <div className="ml-3">
          <h2 className="font-semibold text-[22px] text-[#086DC0]">John Doe</h2>
          <div className="flex items-center gap-2">
            <p className="w-[10px] h-[10px] bg-[#00F026] rounded-full"></p>
            <span className="text-sm">Active</span>
          </div>
        </div>
        <div className="flex flex-row ml-auto space-x-4">
          <div className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110">
            <img src={Call} alt="Call" />
          </div>
          <div className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110">
            <img src={VideoCall} alt="Video Call" />
          </div>
          <div
            className="p-2 duration-200 ease-in-out cursor-pointer hover:scale-110"
            onClick={() => handleDetail((prev) => !prev)}
          >
            <img src={DetailChatIcon} alt="Detail Chat" />
          </div>
        </div>
      </div>
    </div>
  );
}
