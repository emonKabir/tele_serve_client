import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const errorMsg = 'Something went wrong. Try again!!';
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [phoneHash, setPhoneHash] = useState('');
  const [flag, setFlag] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [counter, setCounter] = useState(0);
  //const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl = 'http://18.139.219.242:14763';
  const toastId = 'loader';

  useEffect(() => {
    if (!flag) {
      (async () => {
        const url = baseUrl + '/dashboard';
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
    axios
      .post(baseUrl + '/send_otp', {
        phone: '+88' + number,
      })
      .then(function (response) {
        console.log(response);
        const data = response.data;
        if (data.status === 'failed') {
          displayToast(data.message, 'error');
        } else {
          setPhoneHash(response.data.phone_hash);
          setFlag(!flag);
          const msg = 'Successfully sent otp request';
          displayToast(msg);
        }
      })
      .catch(function (error) {
        console.log(error);

        displayToast(errorMsg, 'error');
      });
    toast.dismiss(toastId);
  };

  const handleSubmitOtp = (e) => {
    //// make request here ////
    //setIsSubmitting(true);
    loader();
    const url = baseUrl + '/sign_in';
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

    toast.dismiss(toastId);
    //setIsSubmitting(false);
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
