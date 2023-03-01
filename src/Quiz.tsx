import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import {useQuiz} from './hooks';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingTop: 32,
  },
  title: {
    padding: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderRadius: 5,
    marginBottom: 24,
  },
  option: {
    padding: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    borderRadius: 5,
    marginBottom: 8,
  },
});

export const Quiz = ({navigation}) => {
  const [data, loading, error, append] = useQuiz();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = data[currentQuestionIndex];

  const nextQuestion = () => {
    if (currentQuestionIndex === data.length - 1) {
      setCurrentQuestionIndex(0);
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleAnswer = (option) => {
    if (currentQuestionIndex === data.length - 1) {
      setCurrentQuestionIndex(0);
      append(answers);
      setAnswers([]);
      navigation.navigate('Thankyou');
      return;
    }

    const newAnswer = {
      question: {id: currentQuestion.id, title: currentQuestion.title},
      answer: option,
    };

    setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
    nextQuestion();
  };

  if (loading || !currentQuestion) {
    return (
      <View>
        <Text>Идет загрузка данных</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>{currentQuestion.title}</Text>
        {currentQuestion.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.option}
            onPress={() => handleAnswer(option)}>
            <Text>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
