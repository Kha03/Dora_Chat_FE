/* eslint-disable react/prop-types */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function AlertMessage({ type, message }) {
  const alertStyles = {
    error: {
      className: "border-red-500 bg-red-50 text-red-600",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    },
    success: {
      className: "border-green-500 bg-green-50 text-green-600",
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    },
    info: {
      className: "border-blue-500 bg-blue-50 text-blue-600",
      icon: <Info className="h-4 w-4 text-blue-600" />,
    },
  };

  if (message) {
    const lines = message.split("\n");
    const firstLine = lines[0];
    const remainingLines = lines.slice(1);

    toast(
      <div className="w-full max-w-full">
        <div className={`flex items-start p-2 rounded border ${alertStyles[type].className}`}>
          <div className="flex-shrink-0">
            {alertStyles[type].icon}
          </div>
          <div className="ml-2 min-w-0">
            <div className="whitespace-nowrap overflow-x-auto">
              {firstLine}
            </div>
            {remainingLines.map((line, index) => (
              <div key={index} className="whitespace-normal break-words">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>,
      {
        className: "!w-auto !max-w-full",
        bodyClassName: "!w-auto !max-w-full !p-0",
      }
    );
  }

  return <ToastContainer />;
}