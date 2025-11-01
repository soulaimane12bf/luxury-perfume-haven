import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/terms-of-service', { replace: true });
  }, [navigate]);
  
  return null;
};

export default Terms;
