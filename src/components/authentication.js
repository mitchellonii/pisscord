import piss from '../piss.png';
import { useEffect, useState } from 'react'
import React from 'react'
import { getCookie, setCookie, eraseCookie } from "../cookie"

function AuthenticationFlow({ baseServer, devServer, handleLogin, setLSHA, setInitLoad, isAuth, setAuthState, userData, setUserData, api }) {
    var [isLoading, setLoading] = useState(false);
    var [flowState, setFlowState] = useState(0)
    var [transitionOut, setTO] = useState(false)
    var [invalidCredentials, setInvalidCredentials] = useState(false)

    async function login() {
        setLoading(true)
        setFlowState(2);
        try {
            let x = await api.login({ email: document.getElementById("email").value, password: document.getElementById("password").value })
            if (x == true) {
                let data = await api.getUserInfo();
                setUserData(data);
                setCookie("access_token", api.access_token, 300)
                setInvalidCredentials(false);
            }
            else {
                setFlowState(1);
                setLoading(false);
                setInvalidCredentials(true)
            }
        } catch (e) {
            if (e.toString().includes("Failed to fetch")) {
                setLoading(false);
                setFlowState(3)
            }
        }

    }

    function endFlow() {
        setTO(true);//transition out
        setTimeout(() => {
            setAuthState(true);//remove auth screen from the DOM
            handleLogin()
        }, 2000)
    }
    function handleFormSubmit(e) {
        e.preventDefault()
    }
    function validateEmail(e) {
        let reg = /^\S+@\S+\.\S+$/
        let state = reg.test(e.target.value)
        if (state == false) e.target.classList.add("invalid")
        else e.target.classList.remove("invalid")
    }
    function handleReset(e) {
        e.preventDefault()
        setFlowState(0)
        setUserData({})
        eraseCookie("access_token")
    }

    function imageLoaded(e) {
        setLoading(false)
        e.currentTarget.style.opacity = "1"
    }



    function devServerHandler() {
        setTO(true);//transition out
        setTimeout(() => {
            devServer()
        }, 2000)
    }
    function baseServerHandler() {
        setTO(true);//transition out
        setTimeout(() => {
            baseServer()
        }, 2000)
    }




    if (isAuth) return;
    return <div className={"authContainer" + (transitionOut ? " out" : "")}>
        <div className="display">
            <AuthLoader display={isLoading} />
            <div className={"slider" + (flowState == -1 ? "" : ` flow-state-${flowState}`) + (invalidCredentials ? " invalid" : "")}>
                <div className="slide">
                    <p>Pisscord {(api.baseDomain.includes("lq-dev")) ? "Dev" : ""}</p>
                    <button className="login" onClick={() => { setFlowState(1) }}>Login</button>
                    {(api.baseDomain.includes("lq-dev")) ? <button className="login" onClick={baseServerHandler}>Switch to non-dev</button> : <button className="login" onClick={devServerHandler}>Switch to dev</button>}
                    <img src={piss}></img>
                </div>
                <div className="slide">
                    <p>Pisscord {(api.baseDomain.includes("lq-dev")) ? "Dev" : ""}</p>
                    {invalidCredentials == true ? <h1>Email and/or password is incorrect</h1> : <></>}
                    <form onSubmit={handleFormSubmit}>
                        <section>
                            <label htmlFor="email">Email</label>
                            <input id="email" className="email" onInput={validateEmail} autoComplete='current-email'></input>
                        </section>
                        <section>
                            <label htmlFor="password" >Password</label>
                            <input id="password" type="password" className=" password" autoComplete='current-password'></input>
                        </section>
                    </form>
                    <button className="submit" onClick={login}>Submit</button>
                </div>
                <div className="slide">
                    <h1>Welcome,<br />{userData?.username}</h1>
                    <img style={{ opacity: 0 }} onLoad={imageLoaded} src={userData?.avatar}></img>
                    <button className="enter" onClick={endFlow}>Ok</button>
                    <a href="/" onClick={handleReset}>Not you? Logout</a>
                </div>
                <div className="slide">
                    <h1>Error</h1>
                    <h2>Failed to fetch user info on the server {api.baseDomain}</h2>
                    {api.baseDomain.includes("lq-dev") ? <button className="enter" onClick={devServerHandler}>Try default server?</button> : <button className="enter" onClick={devServerHandler}>Try dev server?</button>}

                </div>
            </div>
        </div >
    </div >
}

function AuthLoader({ display }) {
    if (display == false) return
    return <div className="loader">
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
}

export default AuthenticationFlow