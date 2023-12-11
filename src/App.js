import './App.css';
import { useState } from 'react';

function App() {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [flag, setFlag] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmitNumber = (e) => {
    setFlag(!flag);
    setNumber('');
  };

  const handleSubmitOtp = (e) => {
    //// make request here ////

    setIsSubmitted(true);
    //setFlag(!flag);
    setOtp('');
  };

  const handleAnotherNumber = () => {
    setIsSubmitted(false);
    setFlag(false);
  };

  const renderNumber = () => (
    <>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        type="number"
        placeholder="Enter your 11 digits number here. e.g- 019xxxxxxxx"
      />
      <button onClick={handleSubmitNumber} disabled={!number}>
        Submit
      </button>
    </>
  );

  const renderOtp = () => (
    <>
      <input
        disabled={isSubmitted}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        type="number"
        placeholder="Enter OTP"
      />
      <button onClick={handleSubmitOtp} disabled={!otp}>
        Submit
      </button>
      <button onClick={handleAnotherNumber} disabled={!isSubmitted}>
        Add Another Number
      </button>
    </>
  );

  return (
    <div className="centered-container">
      <div className="centered-form">
        {!flag ? renderNumber() : renderOtp()}
      </div>
    </div>
  );
}

export default App;
