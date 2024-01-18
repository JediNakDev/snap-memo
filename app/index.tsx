import { View, Text, Button, SafeAreaView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";

type Note = {
  id: number;
  topic: string;
  content: string;
  isPinned: boolean;
  date: Date;
};
export { Note };

export default function Page() {
  const db = SQLite.openDatabase("notes.db");
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, topic TEXT, content TEXT, isPinned INTEGER, date INTEGER)"
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        [],
        (txObj, resultSet) => setNotes(resultSet.rows._array as Note[]),
        (txObj, error) => {
          console.log(error);
          return true;
        }
      );
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading</Text>
      </SafeAreaView>
    );
  }

  const showTmpNotes = () => {
    return notes.map((note) => {
      if (note.isPinned) return;
      if (note.topic === "") {
        return (
          <Link href={`/note/${note.id}`} key={note.id}>
            New note
          </Link>
        );
      }
      return (
        <Link href={`/note/${note.id}`} key={note.id}>
          {note.topic}
        </Link>
      );
    });
  };

  const addTmpNote = () => {
    const currentDate = new Date();

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (topic, content, isPinned, date) VALUES (?, ?, ?, ?)",
        ["", "", 0, currentDate.getTime()],
        (txObj, resultSet) => {
          const lastInsertedId = resultSet.insertId;
          setNotes((prevNotes) => [
            ...prevNotes,
            {
              id: lastInsertedId as number,
              topic: "",
              content: "",
              isPinned: false,
              date: currentDate,
            },
          ]);

          router.replace(`/note/${lastInsertedId}`);
        },
        (txObj, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  const showPinnedNotes = () => {
    return notes.map((note) => {
      if (!note.isPinned) return;
      return (
        <Link href={`/note/${note.id}`} key={note.id}>
          {note.topic}
        </Link>
      );
    });
  };

  const addPinnedNote = () => {
    const currentDate = new Date();

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (topic, content, isPinned, date) VALUES (?, ?, ?, ?)",
        ["", "", 1, currentDate.getTime()],
        (txObj, resultSet) => {
          const lastInsertedId = resultSet.insertId;
          setNotes((prevNotes) => [
            ...prevNotes,
            {
              id: lastInsertedId as number,
              topic: "",
              content: "",
              isPinned: true,
              date: currentDate,
            },
          ]);

          router.replace(`/note/${lastInsertedId}`);
        },
        (txObj, error) => {
          console.log(error);
          return true;
        }
      );
    });
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Notes</Text>
      </View>
      <Text>Pinned Memo</Text>
      <Button title="Add" onPress={addPinnedNote} />
      {showPinnedNotes()}
      <Text>Snap Memo</Text>
      <Button title="Add" onPress={addTmpNote} />
      {showTmpNotes()}
    </SafeAreaView>
  );
}
