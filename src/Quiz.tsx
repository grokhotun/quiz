import React, {useState} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

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
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export const Quiz = () => {
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

  const prevQuestion = () => {
    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex(0);
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleAnswer = (option) => {
    if (currentQuestionIndex === data.length - 1) {
      setCurrentQuestionIndex(0);
      append(answers);
      setAnswers([]);
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
          <View key={option.id} style={styles.option}>
            <Text onPress={() => handleAnswer(option)}>{option.title}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttons}>
        <Button onPress={prevQuestion} title="Назад" />
        <Button onPress={nextQuestion} title="Дальше" />
      </View>
    </View>
  );
};
