import {useSelector} from 'react-redux';
import PublicNavbar from './PublicNavbar';
import PrivateNavbar from './PrivateNavbar';
import AdminNavbar from './AdminNavbar';

const Header = () => {
    // const {userInfo} = useSelector((state) => state.auth);
    const state = useSelector((state) => state.auth);
    const { userInfo } = state;
  
    return (
        <>
        {userInfo && userInfo.isAdmin ? (
          <AdminNavbar isLogin={userInfo} />
        ) :  userInfo ? (
          <PrivateNavbar isLogin={userInfo} />
        ) : (
          <PublicNavbar />
        )}
      </>
       
    )
};

export default Header;








