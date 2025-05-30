/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Input } from "./input";
import { Button } from "./button";

export function AddChannelModal({
  isOpen,
  onClose,
  onAdd,
  initialName = "",
  isEditing = false,
}) {
  const [channelName, setChannelName] = useState(initialName);
  const [error, setError] = useState("");

  useEffect(() => {
    setChannelName(initialName);
  }, [initialName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate channel name
    if (!channelName.trim()) {
      setError("Channel name cannot be empty");
      return;
    }

    // Create new channel
    onAdd({
      name: channelName.trim(),
    });

    // Reset form
    setChannelName("");
    setError("");
  };

  const handleClose = () => {
    setChannelName("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Channel" : "Add New Channel"}
      style={{ zIndex: 1000 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="channel-name"
            className="block text-sm font-medium text-gray-700 mb-1 !font-bold text-left"
          >
            Channel Name:
          </label>
          <Input
            id="channel-name"
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value);
              setError("");
            }}
            placeholder="Enter channel name"
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isEditing ? "Save Changes" : "Create Channel"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
