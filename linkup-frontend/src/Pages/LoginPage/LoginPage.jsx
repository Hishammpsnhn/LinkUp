import React, { useState } from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginPage(){

    const [emailinput, setemailinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");
    const [output, setOutput] = useState("");
    const navigate=useNavigate();

    const handleSubmit = async (e)=>{
        if(emailinput==="" || passwordinput===""){
          setOutput("all fields are required");
          return;
        }
        try {
          const response = await axios.post('http://localhost:3001/login',{emailinput,passwordinput} );
          console.log(response.data);     
        } catch (err) {
          console.log(err.response.data);
        }
    }
      
    const login = useGoogleLogin({
        client_id: process.env.client_id || "727992305515-cvm709miv8d2fnmtqcf9ovv0vgqktsdc.apps.googleusercontent.com",
        onSuccess: response => loginsuccess(response),
    });
    
    function loginsuccess(response) {
        const { access_token } = response;
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(response => response.json())
        .then(userData => {
          console.log("User Data:", userData);
          // Access specific properties of the userData object
          console.log("Name:", userData.name);
          console.log("Email:", userData.email); 
          console.log("Picture:", userData.picture);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }

    return(
        <>
            <div className="login-page-outer">
                <div className="login-form-outer">
                    <div className="login-page-title">Welcome back</div>

                    <div className="label">Email Address</div>
                    <input type="email" placeholder="youremail@example.com" 
                            value={emailinput} onChange={(e)=>{setemailinput(e.target.value)}}/>

                    <div className="label">Password</div>
                    <input type="password" placeholder="••••••••••"
                            value={passwordinput} onChange={(e)=>{setpasswordinput(e.target.value)}}   />

                    <div style={{color:"red"}}>{output}</div>
                    <input type="submit" className="login-btn" value="Login" onClick={handleSubmit}/>
                    <div style={{ textAlign: "center" }} ><Link to={'/forgot'}>Forgot your Password?</Link></div>
                    <div>Don't have an account <Link to={'/signup'}>sign up</Link></div>
                    <div className="or">or</div>
                    <div className="google-login-btn" onClick={()=>{login()}}>
                        Login with Google
                        <img src={googleicon} className="googleicon" alt="google-icon"/>
                    </div>

                </div>
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
            </div>
        </>
    )
}
