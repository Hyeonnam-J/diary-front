import { LayoutRouteProps } from "react-router-dom";
import My from "../fragments/My";

import '../../stylesheets/common/common.css';
import '../../stylesheets/common/layout.css';

const SignLayout: React.FC<LayoutRouteProps> = (props) => {
    return (
        <div className="container">
            <My />
            <main className='main-sign'>
                {props.children}
            </main>
        </div>
    );
}

export default SignLayout;
