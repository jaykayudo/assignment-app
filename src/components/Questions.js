import { Button, message, Steps, Card } from 'antd';
import axios from 'axios';
import { useEffect, useState, useRef, useContext } from 'react';
import GradedAssignmentApi from './apis/gradedassignmentapis';
import './styles/questions.css'
import Choices from './widgets/Choices';
import AuthContext from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Step } = Steps;

const Questions = (props) => {
  const [current, setCurrent] = useState(0);
  const [userAnswer,setUserAnswer] = useState({});
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const {questions, assignmentId } = props;
  const prevButtonRef = useRef();
  const context = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(()=>{
    setQuestionAnswers(questions.map((item)=>({id:item.order,answer:item.answer.title})))
  },[])

  const next = () => {
    setCurrent(current + 1);
  };
  const setUserQuestionAnswer = (id,answer)=>{
    userAnswer[id] = answer;
    setUserAnswer(userAnswer);
  }
  const prev = () => {
    setCurrent(current - 1);
  };
  const calculateGrade =(userAnswer,questionAnswers)=>{
    const totalQuestionsScore = questionAnswers.length;
    let initialScore = 0
    for(let ans of questionAnswers){
      if(userAnswer[ans.id] == ans.answer){
        initialScore += 1
      }
    }
    const grade = (initialScore / totalQuestionsScore) * 100
    return grade
  }
  const handleSubmit = (e) =>{
      message.loading({
        content:"Assignment Processing",
        key:"updatable",
        duration: 1
      })
      e.currentTarget.disabled = true
      prevButtonRef.current.disabled = true
      const grade = calculateGrade(userAnswer,questionAnswers)
      const data = {
          assignment:assignmentId,
          student: context.user.username,
          grade: grade
      }
      axios.post(GradedAssignmentApi.create,data).then(res=>{
        message.success(
          {
            content:"Assignment Processing",
            key:"updatable",
            duration: 1
          }
        )
        navigate("/profile")
        
      }).catch(err=>{
        if(err.response.status === 401 ){
          message.error(
          {
            content:"You are Authorized to Submit this Assignment",
            key:"updatable",
            duration: 1
          })
        }else{
          message.error({
            content:err.message,
            key:"updatable",
            duration: 1
          })
        }
        e.currentTarget.disabled = false
        prevButtonRef.current.disabled = false
      })
  };
  return (
    <>
    { questions.length > 0 ? (
    <>
      <Steps progressDot current={current}>
        {questions.map((idx,item) => (
          <Step key={idx} />
        ))}
      </Steps>
      <Card type="inner" title={`${questions[current].order}. ${questions[current].question}`} style={{marginBottom: "10px"}}>
      <div className="steps-content">
        <Choices userAnswer ={userAnswer} setUserAnswer={setUserQuestionAnswer} questionOrder={questions[current].order} choices={questions[current].choices}/>
        </div>

      </Card>
      <div className="steps-action">
      {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            ref = {prevButtonRef}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current < questions.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === questions.length - 1 && (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
        
      </div>
      </>
      ): <div>No Question</div>}
    </>
  );
};

export default Questions;