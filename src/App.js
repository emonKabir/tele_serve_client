import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const errorMsg = 'Something went wrong. Try again!!';
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [phoneHash, setPhoneHash] = useState('');
  const [flag, setFlag] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const displayToast = (msg = '', type = 'success') => toast[type](msg);

  const handleSubmitNumber = (e) => {
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
      password,
    };
    !isPasswordRequired && delete obj.password;
    axios
      .post(url, obj)
      .then(function (response) {
        console.log('data ', response.data);
        const data = response.data;
        if (data.status === 'failed') {
          displayToast(data.message, 'error');
          if (
            data.hasOwnProperty('password_required') &&
            data['password_required']
          ) {
            setIsPasswordRequired(true);
          }
        } else {
          setIsPasswordRequired(false);
          setIsSubmitted(true);
          setNumber('');
          setOtp('');
          const msg = 'Successfully Login';
          displayToast(msg);
        }
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
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <input
        disabled={isSubmitted || isPasswordRequired}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        type="number"
        placeholder="Enter OTP"
      />
      {isPasswordRequired ? (
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          placeholder="Password"
        />
      ) : (
        <></>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '10px',
          width: '100%',
        }}
      >
        <button onClick={handleSubmitOtp} disabled={!otp}>
          Submit
        </button>
        <button
          onClick={handleAnotherNumber}
          disabled={!isSubmitted}
          style={{ marginLeft: '10px' }}
        >
          Add Another Number
        </button>
      </div>
    </div>
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
