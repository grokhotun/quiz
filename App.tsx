/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {Quiz} from './src/Quiz';
import {useSender} from './src/hooks';

function App(): JSX.Element {
  useSender();

  return <Quiz />;
}

export default App;
