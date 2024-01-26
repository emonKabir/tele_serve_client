import axios from 'axios';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const toastId = 'loader';

  // const wsStart = 'ws://18.143.64.128:14276/ws/';
  // const url = wsStart + 'telegram/';
  // const socket = new WebSocket(url);

  // socket.onopen = function (event) {
  //   console.log('WebSocket connection opened:', event);
  // };
  // socket.onerror = function (event) {
  //   console.log('socket error ', event);
  // };

  // socket.onerror = function (error) {
  //   console.error('WebSocket connection error:', error);
  // };

  // socket.onclose = function (event) {
  //   console.log('WebSocket connection closed:', event);
  // };

  // // Handle incoming messages
  // socket.onmessage = function (event) {
  //   console.log('WebSocket message received:', event.data);
  // };

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
  const connection = useRef(null);
  //const [isSubmitting, setIsSubmitting] = useState(false);
  // useEffect(() => {
  //   console.log('something!!!', socket);
  //   // const socket = getClient();
  //   // socket.on('connect', () => {
  //   //   console.log('WebSocket connection opened');
  //   // });
  //   // socket.on('disconnect', () => {
  //   //   console.log('WebSocket connection disconnect');
  //   // });
  //   // socket.on('error', (error) => {
  //   //   console.error('WebSocket connection error:', error);
  //   // });
  // }, []);

  useEffect(() => {
    if (!flag) {
      (async () => {
        const url = 'http://18.143.64.128:14763/dashboard';
        axios
          .get(url)
          .then((resp) => {
            const counter = resp.data.data.total_count;
            setCounter(counter);
          })
          .catch((err) => console.log(err));
      })();
    }
  }, [flag]);

  useEffect(() => {
    const wsStart = 'ws://18.143.64.128:14276/ws/';
    const url = wsStart + 'telegram/';
    const socket = new WebSocket(url);

    socket.onopen = function (event) {
      console.log('WebSocket connection opened:', event);
    };

    socket.onclose = function (event) {
      console.log('WebSocket connection closed:', event);
    };

    connection.current = socket;
  }, []);

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

    const message = JSON.stringify({
      event: 'send_code',
      phone: '+88' + number,
    });
    connection.current.send(message);

    connection.current.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      // Handle the received data (e.g., update UI)
      if (data.event === 'send_code_status') {
        //document.getElementById('phoneCodeHash').value = data.phone_code_hash;
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
      }
    };
  };

  const handleSubmitOtp = (e) => {
    if (!isTwofaFailed) {
      loader();
      const message = JSON.stringify({
        event: 'sign_in',
        phone: '+88' + number,
        code: otp,
        phone_code_hash: phoneHash,
      });
      connection.current.send(message);
      toast.dismiss(toastId);
    }

    connection.current.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);

      // Handle the received data (e.g., update UI)
      if (data.event === 'sign_in_status') {
        loader();
        console.log('sign-in successful ', data.status);
        setIsSubmitted(true);
        setIsTwofaFailed(false);
        setNumber('');
        setOtp('');
        const msg = 'Successfully Login';
        displayToast(msg);
        toast.dismiss(toastId);
      } else if (data.event === '2fa_failed') {
        setIsTwofaFailed(true);
      } else {
        displayToast(data.message);
      }
    };

    if (isTwofaFailed) {
      toast.dismiss(toastId);
      loader();
      const message = JSON.stringify({
        event: 'sign_in_2fa',
        phone: '+88' + number,
        password,
      });
      connection.current.send(message);
    }
    toast.dismiss(toastId);
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
