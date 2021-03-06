import React, { ReactElement, useContext } from "react";
import {
  Image,
  ImageProps,
  ImageStyle,
  ScrollView,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { Icon } from "../Icon";
import { BldText16, RegText16 } from "../Text";

const TextBox = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${pixelScaler(30)}px 0;
  border-width: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(20)}px;
  width: ${pixelScaler(315)}px;
`;

const UpperMargin = styled.View`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 9;
`;

const SuperTextBox = ({
  textLines,
  viewStyle,
  first,
}: {
  textLines: ReactElement[];
  viewStyle?: ViewStyle;
  first?: boolean;
}) => {
  return (
    <View
      style={
        viewStyle
          ? {
              ...viewStyle,
            }
          : null
      }
    >
      {first ? (
        <Icon
          name="super_welcome"
          style={{
            width: pixelScaler(139),
            height: pixelScaler(35),
            marginLeft: pixelScaler(5),
          }}
        />
      ) : (
        <Icon
          name="super"
          style={{
            width: pixelScaler(59),
            height: pixelScaler(35),
            marginLeft: pixelScaler(5),
          }}
        />
      )}
      <TextBox>{textLines}</TextBox>
    </View>
  );
};

const PageContainer = styled.View`
  width: ${pixelScaler(375)}px;
`;

const FooterContainer = styled.View`
  flex: 11;
  align-items: center;
  justify-content: flex-start;
`;

const UpperContainer = styled.View`
  flex: 5;
  align-items: center;
  justify-content: flex-start;
`;

const ImageContainer = styled.View`
  width: ${pixelScaler(315)}px;
  align-items: center;
  justify-content: center;
  padding: ${pixelScaler(5)}px ${pixelScaler(5)}px;
`;

const ShadowedImage = ({
  viewStyle,
  isFloating = false,
  ...props
}: {
  viewStyle?: ViewStyle;
  isFloating?: boolean;
  source: { uri: string };
  style: ImageStyle;
}) => {
  return (
    <View
      style={
        isFloating
          ? {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              ...viewStyle,
            }
          : {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              ...viewStyle,
            }
      }
    >
      <Image {...props} />
    </View>
  );
};

const FeedManual = ({
  scrollIndex,
  setScrollIndex,
}: {
  scrollIndex: number;
  setScrollIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { width, height } = useWindowDimensions();

  const theme = useContext<ThemeType>(ThemeContext);

  return (
    <ScrollView
      pagingEnabled={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        width,
        height: height - pixelScaler(90),
      }}
      onScroll={({ nativeEvent }) => {
        const ind = Math.floor(
          (nativeEvent.contentOffset.x + width / 2) / width
        );
        if (ind != scrollIndex) {
          setScrollIndex(ind);
        }
      }}
      scrollEventThrottle={16}
    >
      <PageContainer>
        <UpperMargin />
        <ContentContainer>
          <UpperContainer>
            <SuperTextBox
              first={true}
              viewStyle={{
                marginBottom: pixelScaler(100),
              }}
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  <BldText16 style={{ color: theme.textHighlight }}>
                    ???????????? ??????
                  </BldText16>
                  ???{" "}
                  <BldText16 style={{ color: theme.textHighlight }}>
                    ???????????? ?????????
                  </BldText16>
                  ???
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ?????? ?????? ???????????? ???????????????.
                </RegText16>,
                <BldText16 />,
                <RegText16 key={"3"} style={{ lineHeight: pixelScaler(23) }}>
                  ??? ???????????? ?????????
                </RegText16>,
                <RegText16 style={{ lineHeight: pixelScaler(23) }}>
                  splace ???????????? ??????????????????
                </RegText16>,
              ]}
            />
          </UpperContainer>
          <FooterContainer>
            <RegText16
              style={{
                color: theme.greyTextAlone,
                position: "absolute",
                right: pixelScaler(30),
                top: pixelScaler(150),
              }}
            >
              {"????????? ???????????? >"}
            </RegText16>
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
      <PageContainer>
        <UpperMargin />
        <ContentContainer>
          <UpperContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ???????????????{" "}
                  <BldText16 style={{ color: theme.textHighlight }}>
                    ?????? or ????????????
                  </BldText16>
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  ????????? ??? ????????????.????????? ????????? ??????
                </RegText16>,
                <RegText16 key={"3"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? or ???????????? ???????????? ???????????????.
                </RegText16>,
              ]}
            />
          </UpperContainer>
          <FooterContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(285),
                  height: pixelScaler(358),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/log.jpg")}
              />
              <ShadowedImage
                isFloating={true}
                viewStyle={{
                  position: "absolute",
                  left: pixelScaler(0),
                  bottom: pixelScaler(87),
                }}
                style={{
                  width: pixelScaler(194),
                  height: pixelScaler(43),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/splace_name.jpg")}
              />
            </ImageContainer>
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
      <PageContainer>
        <UpperMargin />
        <ContentContainer>
          <UpperContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ??????{" "}
                  <BldText16 style={{ color: theme.textHighlight }}>
                    ???????????? ????????? ????????????
                  </BldText16>
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ??? ????????????. ?????? ????????? ????????????
                </RegText16>,
                <RegText16 key={"3"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ???????????? ???????????? ??? ??? ????????????.
                </RegText16>,
              ]}
            />
          </UpperContainer>
          <FooterContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(285),
                  height: pixelScaler(358),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/log.jpg")}
              />
              <ShadowedImage
                isFloating={true}
                viewStyle={{
                  position: "absolute",
                  left: pixelScaler(0),
                  bottom: pixelScaler(47),
                }}
                style={{
                  width: pixelScaler(135),
                  height: pixelScaler(44),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/series_tag.jpg")}
              />
            </ImageContainer>
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
      <PageContainer>
        <UpperMargin />
        <ContentContainer>
          <UpperContainer>
            <SuperTextBox
              textLines={[
                <RegText16 key={"1"} style={{ lineHeight: pixelScaler(23) }}>
                  ????????? ?????? ???????????? ????????? ?????????
                </RegText16>,
                <RegText16 key={"2"} style={{ lineHeight: pixelScaler(23) }}>
                  ?????? ?????? or ????????????{" "}
                  <BldText16 style={{ color: theme.textHighlight }}>
                    ????????? ??????
                  </BldText16>
                  ???
                </RegText16>,
                <RegText16 key={"3"} style={{ lineHeight: pixelScaler(23) }}>
                  ???????????? ????????? ??? ????????????.
                </RegText16>,
              ]}
            />
          </UpperContainer>
          <FooterContainer>
            <ImageContainer>
              <ShadowedImage
                style={{
                  width: pixelScaler(285),
                  height: pixelScaler(358),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/log.jpg")}
              />
              <ShadowedImage
                isFloating={true}
                viewStyle={{
                  position: "absolute",
                  left: pixelScaler(7),
                  bottom: pixelScaler(15),
                }}
                style={{
                  width: pixelScaler(120),
                  height: pixelScaler(42),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: pixelScaler(2),
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: pixelScaler(2),
                }}
                source={require("../../../assets/images/menual/location_tag.jpg")}
              />
            </ImageContainer>
          </FooterContainer>
        </ContentContainer>
      </PageContainer>
    </ScrollView>
  );
};

export default FeedManual;
