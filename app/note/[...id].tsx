import { View, Text, TextInput } from "react-native";
import React, { useRef } from "react";
import { Link } from "expo-router";

export default function Page() {
  const contentRef = useRef<TextInput>(null);

  const focusContent = () => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };

  const saveTopic = (topic: string) => {};

  const saveContent = (content: string) => {};

  return (
    <View>
      <Link href="/">
        <Text>Notes</Text>
      </Link>
      <TextInput
        autoFocus={true}
        onSubmitEditing={focusContent}
        onChangeText={(topic) => saveTopic(topic)}
      />
      <TextInput
        multiline={true}
        ref={contentRef}
        onChangeText={(content) => saveContent(content)}
      />
    </View>
  );
}
