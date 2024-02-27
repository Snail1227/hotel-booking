// Login.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Request } from "./api"; 
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  updateIsAdmin: (isAdmin: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, updateIsAdmin }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  
    const handleReset = () => {
        setEmail("");
        setPassword("");
      };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    if (email && password) {
      Request.logInUser({
        email: email.toLowerCase(),
        password: password,
      })
        .then((data: any) => {
          setIsLoading(false);
          setIsLoggedIn(true);
          localStorage.setItem('logged',  JSON.stringify(data.token));
          toast.success("User logged in successfully");
          updateIsAdmin(data.role);
          navigate('/booking');
          handleReset();
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    } else {
      setIsLoading(false);
      toast.error("Please fill out the form");
    }


  };

  return (
    <div className='contentContainer'>
        <div className="form-wrap">

            <div className="tabs">
            <h3 className="signup-tab">
            <Link to="/signup" className="signup-tab-content">
                Sign Up
            </Link>
            </h3>
            <h3 className="login-tab">
            <Link to="/login" className="login-tab-content active">
                Login
            </Link>
            </h3>
            </div>
            
            <div className="tabs-content">

          <div
            id="signup-tab-content"
            className="signup-tab-content active"
          >

          </div>

           <div
            id="login-tab-content"
            className="login-tab-content active"
          >
            <form className="login-form" action="" method="post" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input"
                id="user_login"
                autoComplete="off"
                placeholder="Email"
                value={email}
                onChange={(e) =>  setEmail(e.target.value)}
              />
              <input
                type="password"
                className="input"
                id="user_pass_login"
                autoComplete="off"
                placeholder="Password"
                value={password}
                onChange={(e) =>  setPassword(e.target.value)}
              />
              <input 
				type="checkbox" 
				className="checkbox" 
				id="remember_me"
			   />
              <label htmlFor="remember_me">Remember me</label>
              <input type="submit" className="button" value="Login" disabled={isLoading}/>
            </form>
            <div className="help-text">
              <p>
                <p>Forget your password?</p>
              </p>
            </div>
          </div>

        </div>

        </div>
    </div>
  );
};

export default Login;
