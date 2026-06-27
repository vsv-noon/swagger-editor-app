import HeaderClient from './HeaderClient';

const Header = async () => {
  const isAuthenticated = false;
  return <HeaderClient isAuthenticated={isAuthenticated}></HeaderClient>;
};

export default Header;
