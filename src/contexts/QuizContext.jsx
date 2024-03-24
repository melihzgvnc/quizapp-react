import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
    questions: [],
  
    // 'loading', 'error', 'ready', 'active', 'finished'
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
  };
  
  function reducer(state, action) {
    switch (action.type) {
      case 'dataReceived':
        return {
          ...state,
          questions: action.payload,
          status: "ready"
        };
      case "dataFailed":
        return {
          ...state,
          status: "error",
        };
      case "start":
        return {
          ...state,
          status: "active",
        };
      case "newAnswer":
        const question = state.questions.at(state.index);
      
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };
      case "nextQuestion":
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };
      case "finish":
        return {
          ...state,
          status: "finished",
          highscore:
            state.points > state.highscore ? state.points : state.highscore, 
        };
      case "restart":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
        }
      default:
        throw new Error("Action unknown");
    }
  }

function QuizProvider({ children }) {
    const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState);
    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

    return (
        <QuizContext.Provider
            value={{
                questions, 
                status, 
                index, 
                answer, 
                points, 
                highscore,
                numQuestions,
                maxPossiblePoints,
                dispatch
            }}
        >
            {children}
        </QuizContext.Provider>
    ) 
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined) throw new Error("QuizContext was used outside the QuizProvider");
    return context;
}

export { QuizProvider, useQuiz };