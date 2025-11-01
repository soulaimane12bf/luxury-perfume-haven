import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/shipping-policy', { replace: true });
  }, [navigate]);
  
  return null;
};

export default Shipping;
