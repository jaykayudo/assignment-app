import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
const formStyle = {
    display:'block', paddingBottom:'10px'
}
const QuestionFormItem = ({name,restField,remove, idx}) => {
    return ( <Space
        align="baseline"
        style={formStyle}
      >
        <h4>Question {`${idx + 1}`}</h4>
        <Form.Item
          {...restField}
          name={[name, 'question']}
          rules={[
            {
              required: true,
              message: 'Missing Question',
            },
          ]}
          style={{width:"100%"}}
          
        >
          <Input placeholder="Question" />
        </Form.Item>
        <Form.Item
          {...restField}
          name={[name, 'answer']}
          rules={[
            {
              required: true,
              message: 'Missing Answer',
            },
          ]}
        >
          <Input placeholder="answer choice" />
        </Form.Item>
        <Form.List name={[name,'choices']}>
        {(fields, callback) => (
          <>
            {fields.map(({ key, name, ...restField }, indx) => (
              <Space key={key} style={formStyle}>
                 <Form.Item
                    {...restField}
                    name={[name, 'choice']}
                    rules={[
                    {
                    required: true,
                    message: 'Missing Answer',
                    },
                    ]}
                    style={{display:'flex',width: "95%", marginRight:'10px'}}
                        >
                    <Input  placeholder={`choice ${indx+1}`} />
                    </Form.Item><MinusCircleOutlined onClick={() => callback.remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="secondary" onClick={() => callback.add()} icon={<PlusOutlined />}>
                Add question choice
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
        <MinusCircleOutlined onClick={() => remove(name)} />
      </Space> );
}
 
export default QuestionFormItem;