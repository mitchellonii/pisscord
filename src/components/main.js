import piss from "../piss.png";
import { useState } from 'react'
import { getCookie } from "../cookie"


import QuarkList from "./quarkList"
import QuarkEditContext from "./quarkEditMenu"
function Main({ setQuarkOrder, quarkOrder, setSelectedQuarkId, selectedQuarkId, userQuarks, setUserQuarks, isAuth, setAuthState, userData, setUserData, api }) {
    let [displayQuarkEditContext, toggleQuarkEditContext] = useState(false);
    let [displayQuarkEditContextData, toggleQuarkEditContextData] = useState({});



    return <div className="main">
        <QuarkList displayQuarkEditContextData={displayQuarkEditContextData} toggleQuarkEditContextData={toggleQuarkEditContextData} displayQuarkEditContext={displayQuarkEditContext} toggleQuarkEditContext={toggleQuarkEditContext} setQuarkOrder={setQuarkOrder} quarkOrder={quarkOrder} selectedQuarkId={selectedQuarkId} setSelectedQuarkId={setSelectedQuarkId} userQuarks={userQuarks} setUserQuarks={setUserQuarks} isAuth={isAuth} setAuthState={setAuthState} userData={userData} setUserData={setUserData} api={api} />
        <ChannelList />
        <ChannelArea />
        {displayQuarkEditContext ? <QuarkEditContext setUserQuarks={setUserQuarks} api={api} displayQuarkEditContextData={displayQuarkEditContextData} toggleQuarkEditContextData={toggleQuarkEditContextData} displayQuarkEditContext={displayQuarkEditContext} toggleQuarkEditContext={toggleQuarkEditContext} /> : <></>}
    </div>
}







function ChannelList() {
    return <div className="channelList"></div>
}
function ChannelArea() {
    return <div className="channelArea"></div>
}










export default Main
