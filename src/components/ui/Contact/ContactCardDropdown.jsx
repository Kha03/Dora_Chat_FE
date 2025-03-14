/* eslint-disable react/prop-types */
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const ContactCardDropdown = ({
  onViewInfo,
  onCategoryChange,
  onSetNickname,
  onDelete,
}) => {
  const categories = [
    { id: "customer", label: "Customer", color: "bg-red-500" },
    { id: "family", label: "Family", color: "bg-pink-500" },
    { id: "work", label: "Work", color: "bg-orange-500" },
    { id: "friends", label: "Friends", color: "bg-yellow-500" },
    { id: "reply-later", label: "Reply Later", color: "bg-green-500" },
    { id: "study", label: "Study", color: "bg-blue-500" },
  ];

  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <DropdownMenu className="z-50">
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-gray-400 bg-white rounded-full hover:text-gray-600 focus:outline-none">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999] w-56">
        <DropdownMenuItem onClick={onViewInfo}>
          <span>View info</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
            <span>Classify as</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex items-center cursor-pointer"
              >
                <div
                  className={`w-3 h-3 rounded-full ${category.color} mr-2`}
                />
                <span>{category.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={onSetNickname}
          className="flex items-center cursor-pointer"
        >
          <span>Set nickname</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
        >
          <span className="text-red-500">Delete contact</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactCardDropdown;
