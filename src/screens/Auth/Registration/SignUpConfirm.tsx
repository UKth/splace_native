import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  RegistrationStackParamList,
  StackGeneratorParamList,
  ThemeType,
} from "../../../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../../components/ScreenContainer";
import { Image, View } from "react-native";
import { pixelScaler } from "../../../utils";
import { RegText13, RegText20 } from "../../../components/Text";
import { isLoggedInVar } from "../../../apollo";

const ContentContainer = styled.View`
  align-items: center;
`;

const RowContainer = styled.View`
  flex-direction: row;
`;

const UsernameTextContainer = styled.View`
  max-width: ${pixelScaler(200)}px;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 0 ${pixelScaler(30)}px;
  flex-direction: row;
  justify-content: space-between;
`;

const Button = styled.TouchableOpacity`
  width: ${pixelScaler(152.5)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
`;

const SignUpConfirm = () => {
  const navigation =
    useNavigation<StackNavigationProp<RegistrationStackParamList>>();

  const { username } =
    useRoute<RouteProp<RegistrationStackParamList, "SignUpConfirm">>().params;

  const theme = useContext<ThemeType>(ThemeContext);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <ScreenContainer style={{ alignItems: "center", justifyContent: "center" }}>
      <ContentContainer>
        <Image
          source={require("../../../../assets/images/super_registration.png")}
          style={{
            width: pixelScaler(318),
            height: pixelScaler(242),
            marginBottom: pixelScaler(60),
          }}
        />
        <RowContainer>
          <UsernameTextContainer>
            <RegText20
              style={{ lineHeight: pixelScaler(28) }}
              numberOfLines={1}
            >
              {username}
            </RegText20>
          </UsernameTextContainer>
          <RegText20 style={{ lineHeight: pixelScaler(28) }}>
            ??? ???????????????.
          </RegText20>
        </RowContainer>
        <RegText20 style={{ lineHeight: pixelScaler(28) }}>
          ???????????? ????????? ?????? ???
        </RegText20>
        <RegText20
          style={{ lineHeight: pixelScaler(28), marginBottom: pixelScaler(45) }}
        >
          ?????? ?????? ???????????? ???????????????????
        </RegText20>
        <ButtonsContainer>
          <Button
            style={{ borderColor: theme.greyTextLight }}
            onPress={() => {
              isLoggedInVar(true);
            }}
          >
            <RegText13 style={{ color: theme.greyTextLight }}>
              ????????????
            </RegText13>
          </Button>
          <Button
            style={{ borderColor: theme.borderHighlight }}
            onPress={() => navigation.push("TasteCup")}
          >
            <RegText13 style={{ color: theme.textHighlight }}>
              ????????????
            </RegText13>
          </Button>
        </ButtonsContainer>
      </ContentContainer>
    </ScreenContainer>
  );
};

export default SignUpConfirm;
