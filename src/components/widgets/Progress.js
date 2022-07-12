import { Progress } from 'antd';

const ResultProgress = (props) => (
  <>
    <Progress type="circle" percent={props.grade} width={80}/>
  </>
);

export default ResultProgress;