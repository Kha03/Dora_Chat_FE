/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Trash2, SquarePen } from "lucide-react";

export function ChannelContextMenu({ x, y, channel, onDelete, onEdit }) {
  const menuRef = useRef(null);
  return (
    <div
      ref={menuRef}
      className="fixed min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 py-1"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        className="w-full flex items-center px-4 py-2 text-sm text-regal-blue hover:bg-gray-100 border-b"
        onClick={onEdit}
      >
        <SquarePen className="mr-2 h-4 w-4" />
        Rename
      </button>
      <button
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-b"
        onClick={() => onDelete(channel.channelId)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
