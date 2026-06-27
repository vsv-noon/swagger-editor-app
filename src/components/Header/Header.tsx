import HeaderClient from './HeaderClient';

const Header = async () => {
  const isAuthenticated = true;
  return <HeaderClient isAuthenticated={isAuthenticated}></HeaderClient>;
};

export default Header;
