import { Link } from 'react-router-dom';

import '../../stylesheets/fragments/logo.css';

const Logo: React.FC = () => {
    return (
        <Link to={'/'} id='logo'>
            DIARY !
        </Link>
    )
}

export default Logo;