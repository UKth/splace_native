import React, { useState, useRef, useContext, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
  Alert,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  AuthStackParamList,
  RegistrationStackParamList,
  ThemeType,
} from "../../types";
import { setStatusBarStyle } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import { BldText13, BldText16, RegText13 } from "../../components/Text";
import { HeaderRightIcon } from "../../components/HeaderRightIcon";
import { pixelScaler } from "../../utils";
import ScreenContainer from "../../components/ScreenContainer";
import { BldTextInput28 } from "../../components/TextInput";
import { useMutation, useQuery } from "@apollo/client";
import {
  FIND_USERNAME,
  REQUEST_CERTIFICATE,
  VERIFY_CERTIFICATE,
} from "../../queries";
import * as Linking from "expo-linking";
import { ProgressContext } from "../../contexts/Progress";

const ConfirmButton = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${pixelScaler(75)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const TemporaryTextContainer = styled.View`
  height: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(25)}px;
`;

const CertifyForUsername = () => {
  const [phone, setPhone] = useState<string>("");
  const [certificate, setCertificate] = useState<string>("");

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [sent, setSent] = useState(false);
  const [lastTime, setLastTime] = useState(180);
  const [certificateFailed, setCertificateFailed] = useState(false);

  const { spinner } = useContext(ProgressContext);
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  const onVerifyCompleted = (data: any) => {
    if (data?.checkCertificate?.ok && data?.checkCertificate?.token?.length) {
      navigation.push("ShowUsername", {
        token: data?.checkCertificate?.token,
      });
      if (timerId) {
        clearInterval(timerId);
      }
      setLastTime(0);
    } else {
      setCertificateFailed(true);
      setCertificate("");
    }
  };

  const [verifyMutation, { loading: verifyMutationLoading }] = useMutation(
    VERIFY_CERTIFICATE,
    {
      onCompleted: onVerifyCompleted,
    }
  );

  const onRequestCompleted = (data: any) => {
    spinner.stop();
    if (data?.createCertificate?.ok) {
      setSent(true);
      setCertificateFailed(false);
      setLastTime(180);
      if (timerId) {
        clearInterval(timerId);
      }
      setTimerId(
        setInterval(() => {
          setLastTime((prev) => (prev > 0 ? prev - 1 : prev));
        }, 1000)
      );

      Alert.alert("??????????????? ?????????????????????.");
    } else {
      Alert.alert("???????????? ????????? ??????????????????.");
    }
  };

  const [requestMutation, { loading: requestMutationLoading }] = useMutation(
    REQUEST_CERTIFICATE,
    {
      onCompleted: onRequestCompleted,
    }
  );

  const requestCertificate = () => {
    setCertificate("");
    // clearInterval(timerId);
    if (phone.length > 9) {
      if (!requestMutationLoading) {
        spinner.start();
        requestMutation({
          variables: {
            phone,
            isRegister: false,
          },
        });
      }
    }
  };

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => <BldText16>????????? ??????</BldText16>,
      headerLeft: () => null,
      headerRight: () => (
        <HeaderRightIcon
          iconName="close"
          iconStyle={{ width: pixelScaler(11), height: pixelScaler(11) }}
          onPress={() => navigation.pop()}
        />
      ),
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={40}
      style={{
        backgroundColor: theme.background,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenContainer
          style={{
            alignItems: "center",
            paddingTop: pixelScaler(50),
          }}
        >
          <BldText13 style={{ lineHeight: pixelScaler(20) }}>
            ?????? ????????? ????????? ???????????????.
          </BldText13>
          <BldText13 style={{ marginBottom: pixelScaler(60) }}>
            ???????????? ????????? ????????? ????????? ??????????????????.
          </BldText13>
          <BldTextInput28
            value={phone}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setPhone(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="010XXXXXXXX"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="number-pad"
            maxLength={11}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {sent ? (
              <RegText13>
                {"??????????????? ?????? ???????????????? "}
                <RegText13
                  style={{ color: theme.textHighlight }}
                  onPress={() => {
                    // clearInterval(timerId);
                    requestCertificate();
                  }}
                >
                  ?????????
                </RegText13>
              </RegText13>
            ) : null}
          </TemporaryTextContainer>
          <BldTextInput28
            value={certificate}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => {
              setCertificate(text.trim());
              setCertificateFailed(false);
            }}
            selectionColor={theme.chatSelection}
            placeholder="????????????"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {sent ? (
              certificateFailed ? (
                <BldText13 style={{ color: theme.errorText }}>
                  ??????????????? ???????????? ????????????.
                </BldText13>
              ) : (
                <BldText13>
                  {Math.floor(lastTime / 60) +
                    (lastTime % 60 < 10 ? ":0" : ":") +
                    (lastTime % 60)}
                </BldText13>
              )
            ) : null}
          </TemporaryTextContainer>
          {sent ? (
            !certificateFailed && certificate.length === 6 ? (
              <ConfirmButton
                style={{ borderColor: theme.borderHighlight }}
                onPress={() => {
                  verifyMutation({
                    variables: {
                      phone,
                      certificate,
                    },
                  });
                }}
              >
                <RegText13 style={{ color: theme.textHighlight }}>
                  ??????
                </RegText13>
              </ConfirmButton>
            ) : (
              <ConfirmButton style={{ borderColor: theme.greyTextLight }}>
                <RegText13 style={{ color: theme.greyTextLight }}>
                  ??????
                </RegText13>
              </ConfirmButton>
            )
          ) : phone.length > 9 ? (
            <ConfirmButton
              style={{ borderColor: theme.borderHighlight }}
              onPress={requestCertificate}
            >
              <RegText13 style={{ color: theme.textHighlight }}>??????</RegText13>
            </ConfirmButton>
          ) : (
            <ConfirmButton style={{ borderColor: theme.greyTextLight }}>
              <RegText13 style={{ color: theme.greyTextLight }}>??????</RegText13>
            </ConfirmButton>
          )}
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default CertifyForUsername;
