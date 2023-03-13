import { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import PullDownExpandable from "rn-pull-down-expandable";

const data = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
  [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
]
export default function App() {
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <PullDownExpandable
          startHeight={100}
          maxHeight={400}
          renderHandle={
            <View
              style={{ height: 10, backgroundColor: "#eeeeee", width: "100%" }}
            />
          }
          onSwipeLeft={() => {
            if (currentDataIndex >= data.length - 1) return;

            setCurrentDataIndex(currentDataIndex => currentDataIndex + 1);
          }}
          onSwipeRight={() => {
            if (currentDataIndex === 0) return;

            setCurrentDataIndex(currentDataIndex => currentDataIndex - 1);
          }}
        >
          <View style={{ width: "100%", backgroundColor: "#eeffee" }}>
            {data[currentDataIndex].map((x) => {
              return (
                <View key={JSON.stringify(x)}>
                  <Text>{x}</Text>
                  <Text>{x}</Text>
                  <Text>{x}</Text>
                </View>
              );
            })}
          </View>
        </PullDownExpandable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    marginTop: 200,
    height: 100,
    width: "100%",
  },
  box: {
    height: 10,
    backgroundColor: "red",
  },
});

