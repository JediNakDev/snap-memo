import { View, Text, Button, SafeAreaView, FlatList } from "react-native";
import React from "react";
import { Link } from "expo-router";

const data = [
  {
    id: "1",
    link: "/note/1",
    date: new Date(),
    topic: "New note",
    content: "svbl;eb",
    type: "tmp",
  },
  {
    id: "2",
    link: "/note/2",
    date: new Date(),
    topic: "New note 2",
    content: "svbl;eb",
    type: "tmp",
  },
  {
    id: "3",
    link: "/note/3",
    date: new Date(),
    topic: "New note 3",
    content: "svbl;eb",
    type: "tmp",
  },
];

export default function Page() {
  return (
    <SafeAreaView>
      <View>
        <Text>Notes</Text>
      </View>
      <Text>Pinned Memo</Text>
      <Button title="Add" />
      <Text>Snap Memo</Text>
      <Button title="Add" />
      <FlatList
        data={data}
        renderItem={({ item }) => <Link href={item.link}>{item.topic}</Link>}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
