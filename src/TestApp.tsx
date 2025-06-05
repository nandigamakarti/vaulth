import React, { useEffect } from 'react';

const TestApp = () => {
  console.log('TestApp: Component rendering');
  
  useEffect(() => {
    console.log('TestApp: Component mounted');
    return () => {
      console.log('TestApp: Component unmounting');
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div>
        <h1>HabitVault</h1>
        <p>Application is loading...</p>
        <p style={{
          fontSize: '16px',
          marginTop: '20px',
          color: '#666'
        }}>
          Please check the browser console for more details.
        </p>
      </div>
    </div>
  );
};

export default TestApp;
