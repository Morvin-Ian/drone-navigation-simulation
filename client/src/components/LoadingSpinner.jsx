export const LoadingSpinner = () => {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading...</p>
  
        <style jsx>{`
          .spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
  
          .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #0066cc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
  
          p {
            color: #666;
            font-size: 16px;
          }
        `}</style>
      </div>
    );
  };

  export default LoadingSpinner;