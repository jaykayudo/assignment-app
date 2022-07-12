import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import QuestionFormItem from './widgets/questionFormItem';

const QuestionsForm = () => {

  return (
    
      <Form.List name="questions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, idx) => (
              <QuestionFormItem idx={idx}key={key} remove={remove} name={name} restField = {{...restField}} />
            ))}
            <Form.Item>
              <Button type="secondary" onClick={() => add()} icon={<PlusOutlined />}>
                Add Question
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
     

  );
};

export default QuestionsForm;