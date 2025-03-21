/* eslint-disable react/prop-types */
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { forwardRef, useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export const DropdownMenu = DropdownMenuPrimitive.Root;

// eslint-disable-next-line react/prop-types
export const DropdownMenuTrigger = forwardRef(({ children, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger ref={ref} {...props}>
    {children}
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// eslint-disable-next-line react/prop-types
export const DropdownMenuContent = forwardRef(({ children, ...props }, ref) => {
  const [align, setAlign] = useState("start");
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.left < viewportWidth / 2) {
          setAlign("start");
        } else {
          setAlign("end");
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DropdownMenuPrimitive.Content
      ref={ref}
      {...props}
      className="min-w-[150px] bg-white rounded-md p-1 shadow-lg z-50 mr-2 ml-2"
      align={align}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

// eslint-disable-next-line react/prop-types
export const DropdownMenuItem = forwardRef(({ children, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    {...props}
    className="text-sm text-gray-700 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer outline-none flex items-center"
  >
    {children}
  </DropdownMenuPrimitive.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = () => (
  <DropdownMenuPrimitive.Separator className="h-px my-1 bg-gray-200" />
);

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

// eslint-disable-next-line react/prop-types
export const DropdownMenuSubTrigger = forwardRef(
  ({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      {...props}
      className="text-sm text-gray-700 rounded-md px-2 py-1.5 hover:bg-gray-100 cursor-pointer outline-none flex items-center justify-between"
    >
      {children}
      <ChevronRight className="w-4 h-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// eslint-disable-next-line react/prop-types
export const DropdownMenuSubContent = forwardRef(
  ({ children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      {...props}
      className="min-w-[150px] bg-white rounded-md p-1 shadow-lg z-50"
    >
      {children}
    </DropdownMenuPrimitive.SubContent>
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
