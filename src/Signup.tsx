// Signup.tsx
import React, { useState } from "react";
import { Request } from "./api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface logInPropsAfterSignUp {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}


const SignUp: React.FC<logInPropsAfterSignUp> = ({ setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleReset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    if (username && email && password) {
      Request.createUser({
        username: username,
        email: email.toLowerCase(),
        password: password,
      })
        .then(() => {
          setIsLoading(false);
          toast.success("User created successfully");
          handleReset();
          Request.logInUser({
            email: email,
            password: password,
          }).then((data) => {
            localStorage.setItem('logged',  JSON.stringify(data.token));
            setIsLoggedIn(true)
          });
          navigate("/booking");
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
    <div className="contentContainer">
      <div className="form-wrap">
        <div className="tabs">
          <h3 className="signup-tab">
            <Link to="/signup" className="signup-tab-content active">
              Sign Up
            </Link>
          </h3>
          <h3 className="login-tab">
            <Link to="/login" className="login-tab-content">
              Login
            </Link>
          </h3>
        </div>

        <div className="tabs-content">
          <div id="signup-tab-content" className="signup-tab-content active">
            <form
              className="signup-form"
              action=""
              method="post"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="input"
                id="user_name"
                autoComplete="off"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                className="input"
                id="user_email"
                autoComplete="off"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="input"
                id="user_pass_signup"
                autoComplete="off"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="submit"
                className="button"
                value="Sign Up"
                disabled={isLoading}
              />
            </form>
            <div className="help-text">
              <p>By signing up, you agree to our</p>
              <p>
                <p>Terms of service</p>
              </p>
            </div>
          </div>

          <div
            id="login-tab-content"
            className="login-tab-content active"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
