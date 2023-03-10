import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mock = [
  {
    id: 1,
    title: 'Часто ли вы посещаете наше заведение?',
    options: [
      {id: 4, title: 'Ответ 1 вопроса 1'},
      {id: 5, title: 'Ответ 2 вопроса 1'},
      {id: 6, title: 'Ответ 3 вопроса 1'},
    ],
  },
  {
    id: 2,
    title: 'Понравилась ли вам еда?',
    options: [
      {id: 7, title: 'Ответ 1 вопроса 2'},
      {id: 8, title: 'Ответ 2 вопроса 2'},
      {id: 9, title: 'Ответ 3 вопроса 2'},
    ],
  },
  {
    id: 3,
    title: 'Придете ли вы еще?',
    options: [
      {id: 10, title: 'Ответ 1 вопроса 3'},
      {id: 11, title: 'Ответ 2 вопроса 3'},
      {id: 12, title: 'Ответ 3 вопроса 3'},
    ],
  },
];

export const fakeSend = (answers) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(answers);
    }, 2000);
  });
};

const fakeRequest = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mock);
    }, 2000);
  });
};

const fakeError = () => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject('Connection error');
    }, 2000);
  });
};

export const ANSWERS_STORAGE_KEY = 'pending-answers';
const CACHED_DATA_STORAGE_KEY = 'cached-data';

const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log('Ошибка сохранения в локальное хранилище');
  }
};

const clearItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Ошибка очистки локального хранилища');
  }
};

export const useSender = () => {
  const sent = useRef(0);
  const failed = useRef(0);

  useEffect(() => {
    async function checker() {
      console.log('Finding new answers...');
      console.log(`Sent: ${sent.current}`);
      console.log(`Failed: ${failed.current}`);
      console.log(`Total attempts: ${sent.current + failed.current}`);

      // Достаем сохраненные ответы
      const answers = await getItem(ANSWERS_STORAGE_KEY);
      // Если их нет, то логаемся и выходим из функции
      if (!answers) {
        console.log('No data to send, idle...');
        return;
      }

      console.log('Found some answers, sending...', answers);
      setTimeout(() => {
        clearItem(ANSWERS_STORAGE_KEY);
      }, 5000);

      // const promises = Object.values(answers).map(request);
      // Promise.all(promises)
      //   // Успешно отправили на сервер
      //   .then(() => {
      //     // Увеличиваем счетчик
      //     sent.current++;
      //     console.log('Data has been sent');
      //     console.log('Clearing storage...');
      //     // Чистим хранилище так как все ответы мы уже отправили
      //     quizStorage.clear(ANSWERS_STORAGE_KEY);
      //   })
      //   .catch(() => {
      //     // Увеличиваем счетчик
      //     failed.current++;
      //     console.log('Could not send data, maybe next time');
      //   });
    }

    // Создаем интервал который будет слать запросы на сервер с заданной переодичностью
    const sid = setInterval(checker, 5000);
    return () => {
      clearInterval(sid);
    };
  }, []);
};

export const useQuiz = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getQuestions = () => {
    setLoading(true);
    return fakeRequest()
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setData(response);
        return response;
      })
      .catch((error) => {
        setError(error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const append = async (payload) => {
    const answers = await getItem(ANSWERS_STORAGE_KEY);
    if (!answers) {
      const newAnswers = {
        [Date.now()]: payload,
      };

      setItem(ANSWERS_STORAGE_KEY, newAnswers);
      return;
    }

    const next = {...answers, [Date.now()]: payload};

    setItem(ANSWERS_STORAGE_KEY, next);
  };

  useEffect(() => {
    // Делаем запрос на список вопросов
    getQuestions().then((response) => {
      // Сохраняем вопросы локально
      setItem(CACHED_DATA_STORAGE_KEY, response);
    });
  }, []);

  return [data, loading, error, append];
};
