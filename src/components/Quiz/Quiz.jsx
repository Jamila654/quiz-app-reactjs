import React, { useState, useEffect } from 'react';
import he from 'he';
import './Quiz.css';

const Quiz = () => {
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isNameSaved, setIsNameSaved] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.results);
        shuffleAnswers(data.results[0]);
      });
  }, []);

  const shuffleAnswers = (question) => {
    const allAnswers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
    setShuffledAnswers(allAnswers.map(answer => he.decode(answer)));
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextClick = () => {
    const correctAnswer = he.decode(questions[currentQuestionIndex].correct_answer);
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, { question: he.decode(questions[currentQuestionIndex].question), selectedAnswer, correctAnswer }]);
    setSelectedAnswer(null);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      shuffleAnswers(questions[currentQuestionIndex + 1]);
    }
  };

  const handleSaveAndFinishClick = () => {
    const correctAnswer = he.decode(questions[currentQuestionIndex].correct_answer);
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, { question: he.decode(questions[currentQuestionIndex].question), selectedAnswer, correctAnswer }]);
    setShowResults(true);
  };

  const handleSaveName = () => {
    let enteredName = document.querySelector('.enter-name').value;
    if (enteredName) {
      enteredName = enteredName.charAt(0).toLocaleUpperCase() + enteredName.slice(1);
      setName(enteredName);
      setIsNameSaved(true);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (showResults) {
    return (
      <div className='container'>
        <div className='results'>
          <h2>Results</h2>
          <p>{name}, you scored {score} out of {questions.length}</p>
          <p>Percentage: {(score / questions.length) * 100}%</p><br />
          <h3>Review of Your Answers:</h3>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>
                <p><strong>Question:</strong> {answer.question}</p>
                <p><strong>Your Answer:</strong> {answer.selectedAnswer}</p>
                {answer.selectedAnswer !== answer.correctAnswer && (
                  <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className='container'>
      {!isNameSaved && (
        <div className='input'>
          <input type="text" placeholder='Enter Your Name' className='enter-name'/>
          <button className='save-name' onClick={handleSaveName}>Save</button>
        </div>
      )}
      {isNameSaved && (
        <>
          <div className='welcome'>Welcome To The Quiz, {name}</div>
          <hr />
          <div className='questions'>
            <h2>{currentQuestionIndex + 1}. {he.decode(currentQuestion.question)}</h2>
            <ul>
              {shuffledAnswers.map((answer, index) => (
                <li
                  key={index}
                  className={selectedAnswer === answer ? 'selected' : ''}
                  onClick={() => handleAnswerClick(answer)}
                >
                  {answer}
                </li>
              ))}
            </ul>
            {currentQuestionIndex + 1 < questions.length ? (
              <button onClick={handleNextClick} disabled={!selectedAnswer}>Next</button>
            ) : (
              <button onClick={handleSaveAndFinishClick} disabled={!selectedAnswer}>Save & Finish</button>
            )}
          </div>
          <div className='questions-left'>{currentQuestionIndex + 1} of {questions.length} questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;





