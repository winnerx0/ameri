import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { clsx } from "clsx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TagInputProps } from "@/types";

export default function TagInput({
  placeholder = "Type and press space or enter to add...",
  onTagsChange,
  initialTags = [],
  maxTags = 10,
  tagComponent: TagComponent = DefaultTag,
}: TagInputProps) {
  const colorScheme = useColorScheme();
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputText, setInputText] = useState("");

  const addTag = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText && !tags.includes(trimmedText) && tags.length < maxTags) {
      const newTags = [...tags, trimmedText];
      setTags(newTags);
      onTagsChange?.(newTags);
      setInputText("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  const handleTextChange = (text: string) => {
    // Check for space, enter, comma, or semicolon to trigger tag creation
    if (
      text.includes(" ") ||
      text.includes("\n") ||
      text.includes(",") ||
      text.includes(";")
    ) {
      const newTag = text.replace(/[\s\n,;]/g, "");
      if (newTag) {
        addTag(newTag);
      } else {
        setInputText("");
      }
    } else {
      setInputText(text);
    }
  };

  const handleSubmitEditing = () => {
    if (inputText.trim()) {
      addTag(inputText);
    }
  };

  return (
    <View className="relative h-[200px] w-[350px]">
      <View
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "h-full border border-border w-[350px] rounded-2xl p-2 bg-background"
        )}
      >
        {/* Tags Container */}
        <View className="flex-row flex-wrap mb-2">
          {tags.map((tag, index) => (
            <TagComponent
              key={index}
              tag={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </View>

        {/* Input */}
        <TextInput
          value={inputText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmitEditing}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          style={{
            color: colorScheme === "dark" ? "#ffffff" : "#000000",
            flex: 1,
            textAlignVertical: "top",
          }}
          multiline
          blurOnSubmit={false}
          returnKeyType="done"
          className="outline-none"
          maxLength={20}
        />

        {/* Tag count indicator */}
        {tags.length > 0 && (
          <Text
            className={clsx(
              colorScheme === "dark" ? "dark" : "",
              "text-muted-foreground text-xs absolute bottom-1 right-2"
            )}
          >
            {tags.length}/{maxTags}
          </Text>
        )}
      </View>
    </View>
  );
}

const DefaultTag = ({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: () => void;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className={clsx(
        colorScheme === "dark" ? "dark" : "",
        "bg-primary rounded-full px-3 py-1 flex-row items-center m-1"
      )}
    >
      <Text
        className={clsx(
          colorScheme === "dark" ? "dark" : "",
          "text-primary-foreground text-sm mr-2"
        )}
      >
        {tag}
      </Text>
      <TouchableOpacity onPress={onRemove}>
        <Text
          className={clsx(
            colorScheme === "dark" ? "dark" : "",
            "text-primary-foreground text-sm font-bold"
          )}
        >
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
};
