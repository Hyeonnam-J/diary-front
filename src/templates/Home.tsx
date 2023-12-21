import { LayoutRouteProps } from "react-router-dom";
import DefaultLayout from './layouts/DefaultLayout';

const Home: React.FC<LayoutRouteProps> = (props) => {
    return (
        <DefaultLayout>
            a
            {props.children}
        </DefaultLayout>
    );
}

export default Home;
