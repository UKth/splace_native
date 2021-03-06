import React, { useState, useEffect, useRef, useContext } from "react";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { BldTextInput20, BldTextInput28 } from "../../components/TextInput";
import { BldText13, BldText16 } from "../../components/Text";
import { StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../../utils";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { CHANGE_PASSWORD, EDIT_PROFILE } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const ChangePassword = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const theme = useContext<ThemeType>(ThemeContext);
  const { spinner } = useContext(ProgressContext);

  const reg =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$?!@#$%^&*/])[A-Za-z\d$?!@#$%^&*/]{8,}$/;

  const onCompleted = ({
    editPasswordWithLogin: { ok, error },
  }: {
    editPasswordWithLogin: {
      ok: boolean;
      error: string;
    };
  }) => {
    if (ok) {
      Alert.alert("비밀번호가 변경되었습니다.");
      navigation.pop();
    } else if (error === "ERROR1###") {
      Alert.alert("비밀번호가 올바르지 않습니다.");
    } else {
      Alert.alert("비밀번호를 변경할 수 없습니다.\n" + error);
    }
    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(CHANGE_PASSWORD, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>비밀번호 변경</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (password === passwordConfirm && reg.test(password)) {
              spinner.start();
              mutation({
                variables: {
                  password: oldPassword,
                  newPassword: password,
                },
              });
            }
          }}
        />
      ),
    });
  }, [oldPassword, password, passwordConfirm]);

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <BldTextInput28
            selectionColor={theme.chatSelection}
            secureTextEntry={true}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text) => setOldPassword(text)}
            placeholder="기존 비밀번호"
            textAlign="center"
            placeholderTextColor={theme.passwordChangeGreyText}
            style={{
              width: "100%",
              marginTop: pixelScaler(75),
              marginBottom: pixelScaler(75),
            }}
          />
          <BldTextInput28
            selectionColor={theme.chatSelection}
            secureTextEntry={true}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(text) => setPassword(text.trim())}
            placeholder="새 비밀번호"
            textAlign="center"
            placeholderTextColor={theme.passwordChangeGreyText}
            style={{
              width: "100%",
              marginBottom: pixelScaler(20),
            }}
          />
          <BldText13
            style={{
              color:
                password === "" || reg.test(password)
                  ? theme.passwordChangeGreyText
                  : theme.errorText,
              marginBottom: pixelScaler(80),
            }}
          >
            {"영문, 숫자, 특수문자(?!@#$%^&*/) 혼합 8~15자"}
          </BldText13>
          <BldTextInput28
            selectionColor={theme.chatSelection}
            secureTextEntry={true}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text.trim())}
            placeholder="새 비밀번호 확인"
            textAlign="center"
            placeholderTextColor={theme.passwordChangeGreyText}
            style={{
              width: "100%",
              marginBottom: pixelScaler(20),
            }}
          />
          {passwordConfirm !== "" && passwordConfirm !== password ? (
            <BldText13
              style={{
                color: theme.errorText,
              }}
            >
              {"비밀번호가 일치하지 않습니다"}
            </BldText13>
          ) : null}
        </Container>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
};

export default ChangePassword;
