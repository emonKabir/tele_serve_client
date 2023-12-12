import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const errorMsg = 'Something went wrong. Try again!!';
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneHash, setPhoneHash] = useState('');
  const [flag, setFlag] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const displayToast = (msg = '', type = 'success') => toast[type](msg);

  const handleSubmitNumber = (e) => {
    console.log('log ');
    axios
      .post('http://54.251.15.255:8000/send_otp', {
        phone: '+88' + number,
      })
      .then(function (response) {
        console.log(response);
        setPhoneHash(response.data.phone_hash);
        setFlag(!flag);
        const msg = 'Successfully sent otp request';
        displayToast(msg);
      })
      .catch(function (error) {
        console.log(error);
        displayToast(errorMsg, 'error');
      });

    //setNumber('');
  };

  const handleSubmitOtp = (e) => {
    //// make request here ////
    const url = 'http://54.251.15.255:8000/sign_in';
    const obj = {
      phone: '+88' + number,
      phone_hash: phoneHash,
      code: otp,
    };
    axios
      .post(url, obj)
      .then(function (response) {
        console.log('data ', response.data);
        setIsSubmitted(true);
        setNumber('');
        setOtp('');
        const msg = 'Successfully Login';
        displayToast(msg);
      })
      .catch(function (error) {
        console.log(error);
        displayToast(errorMsg, 'error');
      });

    console.log('obj ', obj);
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
      <ToastContainer />
    </div>
  );
}

export default App;
