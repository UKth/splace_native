import { useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ScreenStackHeaderRightView } from "react-native-screens";
import styled, { ThemeContext } from "styled-components/native";
import { menualCheckedVar } from "../apollo";
import { Icons } from "../icons";
import {
  RootStackParamList,
  StackGeneratorParamList,
  ThemeType,
} from "../types";
import { pixelScaler } from "../utils";
import { Icon } from "./Icon";
import { BldText16 } from "./Text";

const Container = styled.SafeAreaView`
  width: 100%;
  height: ${pixelScaler(95)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
  box-shadow: 0 0 0.3px rgba(0, 0, 0, 0.25);
`;

const HeaderLeftContainer = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${pixelScaler(90)}px;
  height: ${pixelScaler(50)}px;
  z-index: 1;
`;

const HeaderRightContainer = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${pixelScaler(55)}px;
  height: ${pixelScaler(50)}px;
  z-index: 1;
  /* background-color: #8040f0; */
`;

const AddButtonContainer = styled.View`
  width: ${pixelScaler(25)}px;
  height: ${pixelScaler(25)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(5)}px;
  border-width: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const Bar = styled.View`
  position: absolute;
  width: ${pixelScaler(10)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

const Tag = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  border-width: ${pixelScaler(1.34)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const MainfeedHeader = ({
  pushLog,
  pushSeries,
  pushMoment,
  pushManual,
}: {
  pushLog: any;
  pushSeries: any;
  pushMoment: any;
  pushManual: any;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const theme = useContext<ThemeType>(ThemeContext);

  const menualChecked = useReactiveVar(menualCheckedVar);

  let [timer, setTimer] = useState<NodeJS.Timeout>();

  const [showButtons, setShowButtons] = useState(false);
  const openAnim = useRef(new Animated.Value(0)).current;
  const translateX = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [211, 0],
  });

  const opacity_1 = openAnim.interpolate({
    inputRange: [0, 0.3, 0.4],
    outputRange: [0, 0, 1],
  });
  const opacity_2 = openAnim.interpolate({
    inputRange: [0, 0.5, 0.7],
    outputRange: [0, 0, 1],
  });
  const opacity_3 = openAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });

  const rotate = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const foldButtons = Animated.timing(openAnim, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
  });

  const unfoldButtons = Animated.timing(openAnim, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  });

  const openButtons = () => {
    // setShowModal(true);
    unfoldButtons.start(() => setShowButtons(true));
    setTimer(setTimeout(() => closeButtons(), 7000));
  };

  const closeButtons = () => {
    if (timer) {
      clearTimeout(timer);
    }
    foldButtons.start(() => setShowButtons(false));
  };

  return (
    <Container>
      <HeaderLeftContainer>
        {1 === 1 ? (
          <Icon
            name="super"
            style={{
              width: pixelScaler(57),
              height: pixelScaler(34),
              marginLeft: pixelScaler(23),
              marginTop: pixelScaler(5),
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={pushManual}
            // onPress={() => {
            //   const mainStack = navigation
            //     .getParent()
            //     ?.getParent<StackNavigationProp<RootStackParamList>>();
            //   if (mainStack?.push) {
            //     mainStack.push("Manual", { n: 0 });
            //   }
            // }}
          >
            <Icon
              name="super_clickme"
              style={{
                width: pixelScaler(115.9),
                height: pixelScaler(34),
                marginLeft: pixelScaler(23),
                marginTop: pixelScaler(5),
              }}
            />
          </TouchableOpacity>
        )}
      </HeaderLeftContainer>
      <HeaderRightContainer>
        <TouchableOpacity
          hitSlop={{
            top: pixelScaler(10),
            bottom: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
          }}
          onPress={() => {
            if (menualChecked % 4 < 2) {
              const mainStack = navigation
                .getParent()
                ?.getParent<StackNavigationProp<RootStackParamList>>();
              if (mainStack?.push) {
                mainStack.push("Manual", { n: 1 });
                return;
              }
            }
            if (showButtons) {
              closeButtons();
            } else {
              openButtons();
            }
          }}
          style={{
            // position: "absolute",
            // backgroundColor: "#90e0f0",
            top: pixelScaler(12),
          }}
        >
          <AddButtonContainer>
            <Animated.View
              style={{
                alignItems: "center",
                justifyContent: "center",
                transform: [{ rotate: rotate }],
                // backgroundColor: "#90e0f0",
                width: pixelScaler(10),
                height: pixelScaler(10),
              }}
            >
              <Bar />
              <Bar style={{ transform: [{ rotate: "90 deg" }] }} />
            </Animated.View>
          </AddButtonContainer>
        </TouchableOpacity>
      </HeaderRightContainer>
      <Animated.View
        style={{
          transform: [
            {
              translateX: translateX,
            },
          ],
          flexDirection: "row",
          // width: pixelScaler(150),
          // height: pixelScaler(80),
          // backgroundColor: "#e0a0f0",
          position: "absolute",
          bottom: pixelScaler(13),
          right: pixelScaler(68),
        }}
      >
        <Animated.View
          style={{
            opacity: opacity_1,
            marginRight: pixelScaler(10),
          }}
        >
          <Tag
            onPress={pushLog}
            // onPress={() => {
            //   // closeButtons();
            //   navigation.push("UploadLog");
            // }}
          >
            <BldText16>??????</BldText16>
          </Tag>
        </Animated.View>
        <Animated.View
          style={{
            opacity: opacity_2,
            marginRight: pixelScaler(10),
          }}
        >
          <Tag
            onPress={pushSeries}
            // onPress={() => {
            //   navigation.push("UploadSeries");
            // }}
          >
            <BldText16>?????????</BldText16>
          </Tag>
        </Animated.View>
        <Animated.View
          style={{
            opacity: opacity_3,
          }}
        >
          <Tag
            onPress={pushMoment}
            // onPress={() => {
            //   navigation.push("UploadMoment");
            // }}
          >
            <BldText16>?????????</BldText16>
          </Tag>
        </Animated.View>
      </Animated.View>
    </Container>
  );
};

export default MainfeedHeader;
