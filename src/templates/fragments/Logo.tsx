import { Link } from 'react-router-dom';

import DIARY from '../../assets/imgs/DIARY.png';
import '../../stylesheets/fragments/logo.css';

const Logo: React.FC = () => {
    return (
        <Link to={'/'} id='logo'>
            <img src={DIARY} alt='logo' />
        </Link>
    )
}

export default Logo;