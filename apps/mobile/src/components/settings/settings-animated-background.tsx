import React, { memo, useEffect } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useSettingsColors } from './settings-colors';
import { settingsAnimatedBackgroundStyles } from './settings-animated-background.styles';

export const SettingsAnimatedBackground = memo(function SettingsAnimatedBackground() {
  const colors = useSettingsColors();
  const isAndroid = Platform.OS === 'android';

  return (
    <Animated.View pointerEvents="none" style={settingsAnimatedBackgroundStyles.layer}>
      <BackgroundOrb color={colors.primaryContainer} opacity={0.18} style={{ top: 18, right: -96, width: 260, height: 260 }} deltaX={22} deltaY={30} scaleTo={1.12} duration={7600} />
      <BackgroundOrb color={colors.secondaryContainer} opacity={0.15} style={{ top: '20%', left: -96, width: 224, height: 224 }} deltaX={26} deltaY={16} scaleTo={1.08} duration={8200} />
      <BackgroundOrb color={colors.tertiaryContainer} opacity={0.13} style={{ top: '42%', right: -28, width: 188, height: 188 }} deltaX={-18} deltaY={20} scaleTo={1.06} duration={7000} />
      <BackgroundOrb color={colors.primary} opacity={0.09} style={{ bottom: '18%', left: -56, width: 204, height: 204 }} deltaX={22} deltaY={-18} scaleTo={1.07} duration={8800} />
      <BackgroundOrb color={colors.secondary} opacity={0.08} style={{ bottom: 64, right: 10, width: 144, height: 144 }} deltaX={-12} deltaY={14} scaleTo={1.04} duration={6800} />
      {!isAndroid ? (
        <>
          <BackgroundOrb color={colors.primaryContainer} opacity={0.1} style={{ top: '12%', left: '28%', width: 132, height: 132 }} deltaX={-14} deltaY={18} scaleTo={1.05} duration={6900} />
          <BackgroundOrb color={colors.secondaryContainer} opacity={0.08} style={{ top: '56%', left: '18%', width: 124, height: 124 }} deltaX={16} deltaY={-14} scaleTo={1.05} duration={7300} />
          <BackgroundOrb color={colors.tertiary} opacity={0.07} style={{ bottom: 170, right: '24%', width: 116, height: 116 }} deltaX={10} deltaY={-12} scaleTo={1.06} duration={6400} />
          <BackgroundOrb color={colors.primary} opacity={0.06} style={{ bottom: 34, left: '34%', width: 96, height: 96 }} deltaX={12} deltaY={10} scaleTo={1.04} duration={6100} />
        </>
      ) : null}
    </Animated.View>
  );
});

function BackgroundOrb(props: {
  color: ViewStyle['backgroundColor'];
  opacity: number;
  style: ViewStyle;
  deltaX: number;
  deltaY: number;
  scaleTo: number;
  duration: number;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const config = { duration: props.duration, easing: Easing.inOut(Easing.sin) };
    translateX.value = withRepeat(withTiming(props.deltaX, config), -1, true);
    translateY.value = withRepeat(withTiming(props.deltaY, config), -1, true);
    scale.value = withRepeat(withTiming(props.scaleTo, config), -1, true);
  }, [props.deltaX, props.deltaY, props.duration, props.scaleTo, scale, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        settingsAnimatedBackgroundStyles.orb,
        props.style,
        { backgroundColor: props.color, opacity: props.opacity },
        animatedStyle,
      ]}
    />
  );
}
