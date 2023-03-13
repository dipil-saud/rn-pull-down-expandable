import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function PullDownExpandable({
  startHeight, // height without any expansion
  maxHeight, // maxHeight to go to
  children, // content for the main section
  renderHandle, // content for the pull down draggable section
  onSwipeLeft,
  onSwipeRight
}) {
  const previousDrag = useSharedValue(0);
  const height = useSharedValue(startHeight);

  // returns min, max or the provided height
  function getValidHeight(height) {
    "worklet";
    return height > maxHeight
      ? maxHeight
      : height < startHeight
      ? startHeight
      : height;
  }

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newContainerHeight = getValidHeight(
        e.translationY + previousDrag.value + startHeight
      );

      height.value = newContainerHeight;
    })
    .onEnd((e) => {
      const newContainerHeight = getValidHeight(
        e.translationY + previousDrag.value + startHeight
      );

      height.value = withTiming(newContainerHeight, {
        duration: 100,
      });
      previousDrag.value = newContainerHeight - startHeight;
    });

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const swipeGesture = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationX > 150) runOnJS(onSwipeRight)();
      if (e.translationX < -150) runOnJS(onSwipeLeft)();
    });

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[{ overflow: "hidden" }, animatedHeightStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
      <GestureDetector gesture={panGesture}>
        <Animated.View>{renderHandle}</Animated.View>
      </GestureDetector>
    </View>
  );
}
