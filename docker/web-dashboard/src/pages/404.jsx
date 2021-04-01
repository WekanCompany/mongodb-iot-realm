import { Result, Button } from 'antd';
import { Link} from 'react-router-dom';

export const Page404 = (props) =>{
    return <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
  />
}

Page404.propTypes = {

}

Page404.defaultProps = {

}