import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/about-us', { replace: true });
  }, [navigate]);
  
  return null;
};

export default About;
