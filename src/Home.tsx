import React from 'react';
import {Button, View} from 'react-native';

export const Home = ({navigation}) => {
  return (
    <View>
      <Button
        title="Начать опрос"
        onPress={() => navigation.navigate('Questions')}
      />
    </View>
  );
};
