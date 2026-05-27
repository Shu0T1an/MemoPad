import { useState, useRef, useEffect } from "react";
import "./TagInput.css";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

export function TagInput({
  tags,
  onChange,
  suggestions = [],
  placeholder = "输入标签后按回车...",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="tag-input-container">
      <div className="tag-input-wrapper">
        {tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
            <button className="tag-remove" onClick={() => removeTag(tag)}>
              ✕
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="tag-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="tag-suggestions">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="tag-suggestion-item"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
