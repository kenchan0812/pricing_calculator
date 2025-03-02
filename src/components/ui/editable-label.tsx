import { useEffect, useState } from "react";

interface EditableLabelProps {
  text: string;
  onSave: (newText: string) => void;
}

const EditableLabel: React.FC<EditableLabelProps> = ({ text, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text || ""); // Sync value when text changes
  }, [text]);

  const handleDoubleClick = () => setIsEditing(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const handleBlur = () => {
    setIsEditing(false);

    const formattedValue = value
      .replace(/[^a-zA-Z0-9_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    if (formattedValue.trim() !== text) {
      onSave(formattedValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return isEditing ? (
    <input
      type="text"
      value={value}
      autoFocus
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="border px-2 py-1 w-full"
    />
  ) : (
    <span
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer text-gray-800 hover:bg-gray-100 hover: rounded-md font-bold lg:text-5xl md:text-3xl px-1"
    >
      {text || ""}
    </span>
  );
};

export default EditableLabel;
