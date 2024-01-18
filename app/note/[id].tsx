import { View, Text, TextInput } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { Note } from "..";
import * as SQLite from "expo-sqlite";

export default function Page() {
  const db = SQLite.openDatabase("notes.db");
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState<Note[]>();
  const contentRef = useRef<TextInput>(null);
  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE id = ?",
        [id.toString()],
        (txObj, resultSet) => {
          setNote(resultSet.rows._array as Note[]);
          setIsLoading(false);
        },
        (txObj, error) => {
          console.log(error);
          setIsLoading(false);
          return true;
        }
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  const focusContent = () => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  };

  const saveTopic = (topic: string) => {
    const currentDate = new Date();
    db.transaction((tx) => {
      tx.executeSql("UPDATE notes SET topic = ?, date = ? WHERE id = ?", [
        topic,
        currentDate.getTime(),
        id.toString(),
      ]);
    });

    // Update state directly without triggering a re-render
    setNote((prevNote) => {
      if (prevNote) {
        return [{ ...prevNote[0], topic }];
      }
      return prevNote;
    });
  };

  const saveContent = (content: string) => {
    const currentDate = new Date();
    db.transaction((tx) => {
      tx.executeSql("UPDATE notes SET content = ?, date = ? WHERE id = ?", [
        content,
        currentDate.getTime(),
        id.toString(),
      ]);
    });

    // Update state directly without triggering a re-render
    setNote((prevNote) => {
      if (prevNote) {
        return [{ ...prevNote[0], content }];
      }
      return prevNote;
    });
  };

  return (
    <View>
      <Link href="/">
        <Text>{"<"}</Text>
        <Text> Notes</Text>
      </Link>
      {!isLoading && note && (
        <>
          <TextInput
            autoFocus={true}
            onSubmitEditing={focusContent}
            onChangeText={(topic) => saveTopic(topic)}
            value={note[0].topic}
          />
          <TextInput
            multiline={true}
            ref={contentRef}
            onChangeText={(content) => saveContent(content)}
            value={note[0].content}
          />
        </>
      )}
    </View>
  );
}
