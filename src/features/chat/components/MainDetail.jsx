/* eslint-disable react/prop-types */
import AddUser from "@assets/chat/add_user.svg";
import ArrowRight from "@assets/chat/arrow_right.svg";
import Avatar from "@assets/chat/avatar.png";
import Bell from "@assets/chat/bell.svg";
import File from "@assets/chat/file_detail.svg";
import Link from "@assets/chat/link_detail.svg";
import MarkChat from "@assets/chat/mark_chat.svg";
import Member from "@assets/chat/member.svg";
import Picture from "@assets/chat/picture_detail.svg";
import Setting from "@assets/chat/setting_group.svg";
import CheckDecentraliza from "@assets/chat/check_icon.svg";
import Decentraliza from "@assets/chat/decentraliza.svg";
import Dissolve from "@assets/chat/dissolve_icon.svg";
import Trash from "@assets/chat/trash_icon.svg";
import Leave from "@assets/chat/leave_icon.svg";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import PictureList from "./detail_chat/PictureList";
import FileList from "./detail_chat/FileList";
import LinkList from "./detail_chat/LinkList";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/modal";
import ModalAddUser from "./ModalAddUser";
export default function MainDetail({ handleSetActiveTab }) {
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [isMuted, setIsMuted] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };
  return (
    <>
      <Modal
        isOpen={isOpenAddUser}
        onClose={() => setIsOpenAddUser(false)}
        title="Thêm thành viên"
      >
        <ModalAddUser />
      </Modal>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-[#086DC0]">Details</p>
        <div className="flex items-center">
          <div
            onClick={() => setIsOpenAddUser(true)}
            className="flex items-center justify-center bg-white rounded-full cursor-pointer w-9 h-9 hover:opacity-75"
          >
            <img src={AddUser} />
          </div>
          <div className="flex items-center justify-center ml-2 bg-white rounded-full cursor-pointer w-9 h-9 hover:opacity-75">
            <img src={MarkChat} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4 overflow-y-auto h-[calc(100%-3rem)]">
        <img src={Avatar} className="w-16 h-16 rounded-full" alt="Avatar" />
        <div className="flex items-center gap-2 mt-1">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 bg-transparent outline-none border-b border-[#086DC0] text-[#959595F3] w-32"
            />
          ) : (
            <p className="text-xl font-semibold text-[#086DC0]">{name}</p>
          )}
          {isEditing ? (
            <Check
              className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-700"
              onClick={handleSaveClick}
            />
          ) : (
            <Pencil
              className="w-4 h-4 text-[#086DC0] cursor-pointer hover:text-blue-500"
              onClick={handleEditClick}
            />
          )}
        </div>
        <div className="flex items-center w-full mt-5 border-b border-[#E7E7E7] pb-5">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Bell} />
          </div>
          <p className="text-[#086DC0] ml-2">Mute messages</p>
          <div
            className={`relative w-11 h-5 rounded-full cursor-pointer transition-all self-end ml-auto  ${
              isMuted ? "bg-gray-400" : "bg-[#086DC0]"
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            <div
              className={`absolute top-0.5 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isMuted ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
        <div className="flex items-center w-full mt-3">
          <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
            <img src={Member} />
          </div>
          <p className="text-[#086DC0] ml-2">Members (3)</p>
          <div
            onClick={() => handleSetActiveTab({ tab: "members" })}
            className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75"
          >
            <img src={ArrowRight} />
          </div>
        </div>
        <div className="w-full mt-3">
          <div className="flex items-center ">
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Picture} />
            </div>
            <p className="text-[#086DC0] ml-2">Photo/videos (125)</p>
            <div
              onClick={() =>
                handleSetActiveTab({
                  tab: "media",
                  media: "photos/videos",
                })
              }
              className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75"
            >
              <img src={ArrowRight} />
            </div>
          </div>
          <PictureList limit={6} />
        </div>
        <div className="w-full mt-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={File} />
            </div>
            <p className="text-[#086DC0] ml-2">Files (3)</p>
            <div
              onClick={() =>
                handleSetActiveTab({
                  tab: "media",
                  media: "files",
                })
              }
              className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75"
            >
              <img src={ArrowRight} />
            </div>
          </div>
          <FileList limit={3} />
        </div>
        <div className="w-full mt-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-[26px] bg-white rounded-full h-[26px]">
              <img src={Link} />
            </div>
            <p className="text-[#086DC0] ml-2">Link</p>
            <div
              onClick={() =>
                handleSetActiveTab({
                  tab: "media",
                  media: "links",
                })
              }
              className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75"
            >
              <img src={ArrowRight} />
            </div>
          </div>
          <LinkList limit={3} />
        </div>
        <div className="w-full mt-3">
          {/* Header */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setIsOpenSetting(!isOpenSetting)}
          >
            <div className="flex items-center justify-center w-[26px] h-[26px] bg-white rounded-full">
              <img src={Setting} />
            </div>
            <p className="text-[#086DC0] ml-2">Quyền quản trị</p>
            <div className="w-[30px] h-[30px] rounded-[9px] cursor-pointer ml-auto mr-1 bg-white flex items-center justify-center hover:opacity-75">
              <motion.img
                src={ArrowRight}
                animate={{ rotate: isOpenSetting ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* Danh sách xổ xuống */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isOpenSetting ? "auto" : 0,
              opacity: isOpenSetting ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="px-4 mt-2 overflow-hidden"
          >
            {[
              { img: CheckDecentraliza, text: "Phê duyệt thành viên (2)" },
              { img: Decentraliza, text: "Phân quyền thành viên" },
              { img: Dissolve, text: "Giải tán nhóm" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center p-1 mt-1 cursor-pointer hover:opacity-75"
              >
                <img
                  src={item.img}
                  className="w-[18px] h-[18px] rounded-full bg-white p-[3px]"
                  alt="Icon"
                />
                <p className="text-[#F49300] font-bold text-sm ml-1">
                  {item.text}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="w-full mt-[18px] flex items-center justify-center gap-4">
          <button className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl">
            <img src={Trash} alt="trash" />
            <span className="text-[#086DC0]  text-xs ml-2">Xóa nhóm</span>
          </button>
          <button className="flex items-center px-5 py-2 bg-white cursor-pointer hover:opacity-75 rounded-2xl">
            <img src={Leave} alt="leave" />
            <span className="text-[#086DC0]  text-xs ml-2">Rời nhóm</span>
          </button>
        </div>
      </div>
    </>
  );
}
