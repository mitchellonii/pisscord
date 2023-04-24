import './App.css';
import Api from "./lightquark-api"
import { useEffect, useState } from 'react'
import React from 'react'
import AuthenticationFlow from './components/authentication';
import LoadingCover from './components/loadscreen';
import Main from "./components/main"
import { getCookie, setCookie, eraseCookie } from "./cookie"


const baseDomain = "lq.litdevs.org"
const wsBaseDomain = "lq-gateway.litdevs.org"
const devDomain = "lq-dev.litdevs.org"
const wsDevDomain = "lq-gateway-dev.litdevs.org"


var api = new Api({}, baseDomain, wsBaseDomain)




function App() {

  var [initLoad, setInitLoad] = useState(true);
  var [isAuthenticated, setIsAuthenticated] = useState(true);
  var [userData, setUserData] = useState({})
  var [userQuarks, setUserQuarks] = useState([])
  var [loadingScreenHideAnimation, setLSHA] = useState(false)
  var [selectedQuarkId, setSelectedQuarkId] = useState(-1);
  var [quarkOrder, setQuarkOrder] = useState([])
  var [initLoadText, setInitLoadText] = useState(null)

  var wsConnect = false;

  async function connectWebSock() {
    if (wsConnect == true) return
    wsConnect = true;
    let sockState = await api.websocket.connect()
    if (sockState == true) {
      console.log("connected to ws", api.websocket)
      let listner = await api.eventListner()

      var listnerHandler = async (data) => {
        {
          switch (data.eventId) {
            case "subscribe":
              break;
            case "heartbeat":
              break;
            case "quarkOrderUpdate":
              setQuarkOrder(data.order)
              break;
            case "quarkUpdate":
              let uq = await api.getMyQuarks()
              setUserQuarks(uq)
              break;
            case "quarkDelete":
              let p = await Promise.all([api.getMyQuarks(), api.getQuarkOrder()])
              setUserQuarks(p[0]);
              setQuarkOrder(p[1]);
              break;
            default:
              console.log(data)
              break;
            case "channelDelete":
              setUserQuarks(await api.getMyQuarks())
          }
        }
      }


      listner.on("event", listnerHandler)

      var websocketReviver2point0 = async () => {
        api.websocket.connected = false;
        api.websocket.rawsocket = undefined;
        setTimeout(async () => {
          let connectionState = await api.websocket.connect()
          if (connectionState == false) setTimeout(websocketReviver2point0, 5000)
          let listner = await api.eventListner()
          listner.on("event", listnerHandler)
          api.websocket.rawsocket.addEventListener("close", websocketReviver2point0)
          let data = await Promise.all([api.getMyQuarks(), api.getQuarkOrder()])//refetch data just in case somehting was missed while ws closed
          setUserQuarks(data[0])
          setQuarkOrder(data[1])
        }, 5000)

      }
      api.websocket.rawsocket.addEventListener("close", websocketReviver2point0)


    }

  }


  function devServer() {
    api = new Api({}, devDomain, wsDevDomain)
    setInitLoadText(null);
    setInitLoad(true);
    setIsAuthenticated(true)
    setTimeout(checkAuth, 1000)
  }
  function originalServer() {
    api = new Api({}, baseDomain, wsBaseDomain)
    setInitLoadText(null);
    setInitLoad(true);
    setIsAuthenticated(true)
    setTimeout(checkAuth, 1000)
  }


  async function checkAuth() {
    if ([null, undefined].includes(getCookie("access_token"))) {
      setTimeout(() => {
        setIsAuthenticated(false);
      }, 1000)
    } else {
      try {
        let a = await api.getUserInfo({ access_token: getCookie("access_token") })
        if (a.username == undefined) {
          setIsAuthenticated(false);
          eraseCookie("access_token")
          return;
        }

        api.access_token = getCookie("access_token")
        handleLogin()
      } catch (e) {
        if (e.toString().includes("Failed to fetch")) {
          setInitLoadText(<><h2>Error: 502 Failed to fetch.</h2><h2>It looks like the server {api.baseDomain} is down! </h2><button class="submit" onClick={devServer}>Click to try dev server</button></>)
        }
      }

    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  async function handleLogin() {
    api.access_token = getCookie("access_token")
    let data = await Promise.all([api.getMyQuarks(), api.getQuarkOrder(), api.getUserInfo()])
    let quarks = data[0]
    let order = data[1]
    let userInfo = data[2]
    setUserQuarks(quarks)
    setQuarkOrder(order)
    setUserData(userInfo)
    setSelectedQuarkId(order[0])
    connectWebSock()
    setTimeout(() => {
      setLSHA(true)
      setTimeout(() => {
        setInitLoad(false);
      }, 1200)
    }, 1000)

  }


  return (<>
    {(isAuthenticated ? <></> : <AuthenticationFlow baseServer={originalServer} devServer={devServer} handleLogin={handleLogin} userQuarks={userQuarks} setUserQuarks={setUserQuarks} setLSHA={setLSHA} setInitLoad={setInitLoad} isAuth={isAuthenticated} setAuthState={setIsAuthenticated} userData={userData} setUserData={setUserData} api={api} />)}
    <LoadingCover baseDomain={baseDomain} wsBaseDomain={wsBaseDomain} text={initLoadText} state={initLoad} setState={setInitLoad} hide={loadingScreenHideAnimation} setHide={setLSHA} />
    <Main setQuarkOrder={setQuarkOrder} quarkOrder={quarkOrder} selectedQuarkId={selectedQuarkId} setSelectedQuarkId={setSelectedQuarkId} userQuarks={userQuarks} setUserQuarks={setUserQuarks} isAuth={isAuthenticated} setAuthState={setIsAuthenticated} userData={userData} setUserData={setUserData} api={api} />
  </>
  );
}












export default App;
