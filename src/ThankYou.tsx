import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

export const ThankYou = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <Text>Спасибо за ваши ответы!</Text>
    </View>
  );
};
