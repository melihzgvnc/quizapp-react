import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import { useQuiz } from "../contexts/QuizContext";


export default function App() {
  const {status, dispatch} = useQuiz();

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type:"dataReceived", payload: data}))
      .catch((err) => dispatch({type: "dataFailed"}));
  }, []);

  return <div className="app">
    <Header />

    <Main className="main">
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && 
        <StartScreen />
      }
      {status === "active" && 
        <>
          <Progress />
          <Question />
          <NextButton />
        </>
      }
      {status === "finished" && (
        <FinishScreen />
      )}
    </Main>
  </div>
}