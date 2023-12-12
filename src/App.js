import './App.css';
import { useState } from 'react';
import axios from 'axios';
function App() {
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneHash, setPhoneHash] = useState('');
  const [flag, setFlag] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmitNumber = (e) => {
    console.log('log ');
    axios
      .post('http://54.251.15.255:8000/send_otp', {
        phone: '%2B88' + number,
      })
      .then(function (response) {
        console.log(response);
        setPhoneHash(response.data.phone_hash);
      })
      .catch(function (error) {
        console.log(error);
      });
    setFlag(!flag);
    //setNumber('');
  };

  const handleSubmitOtp = (e) => {
    //// make request here ////
    const url = 'http://54.251.15.255:8000/sign_in';
    axios
      .post(url, {
        phone: '%2B88' + number,
        phone_hash: phoneHash,
        code: otp,
      })
      .then(function (response) {
        console.log('data ', response.data);
        //setPhoneHash(response.data.phone_hash)
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log('obj ', {
      phone: number,
      phone_hash: phoneHash,
      code: otp,
    });
    setIsSubmitted(true);
    //setFlag(!flag);
    setNumber('');
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
