import { View, useWindowDimensions } from "react-native";
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

  const { width: screenWidth } = useWindowDimensions();
  const positionLeft = useSharedValue(0);
  const animatedWidthStyle = useAnimatedStyle(() => ({
    left: positionLeft.value,
  }));
  const swipeGesture = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationX > 100) {
        positionLeft.value = withTiming(0 - screenWidth, {
          duration: 200,
        }, () => {
          runOnJS(onSwipeRight)();
          positionLeft.value = withTiming(0, {
            duration: 100,
          });
        });
      }
      if (e.translationX < -100) {
        positionLeft.value = withTiming(screenWidth, {
          duration: 200,
        }, () => {
          runOnJS(onSwipeLeft)();
          positionLeft.value = withTiming(0, {
            duration: 100,
          });
        });
      }
    });

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[{ overflow: "hidden", height: startHeight }, animatedHeightStyle, animatedWidthStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
      <GestureDetector gesture={panGesture}>
        <Animated.View>{renderHandle}</Animated.View>
      </GestureDetector>
    </View>
  );
}
