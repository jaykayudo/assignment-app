import { Input, Radio, Space } from 'antd';
import { useState } from 'react';
const Choices = (props) => {
    const {questionOrder, choices, setUserAnswer, userAnswer} = props;
    const addUserAnswer=(e)=>{
       setUserAnswer(questionOrder,e.target.value)
    }
    const getValue = (id) =>{
        if(userAnswer[id] !== null){
            return userAnswer[id]
        }
        return null;
    }
    return ( <>
        <Radio.Group onChange={addUserAnswer}
        value={`${getValue(questionOrder)}`}
        name={`${questionOrder}`} >
        {choices.map((item)=>(
            <Radio style={{display:"block"}} key={item.id} value={item.title}>{item.title}</Radio>
        ))}
        </Radio.Group>
    </> );
}
 
export default Choices;