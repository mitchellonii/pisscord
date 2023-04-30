import piss from "../piss.png";
import { useEffect, useState } from 'react'
import { getCookie } from "../cookie"


import QuarkList from "./quarkList"
import QuarkEditContext from "./quarkEditMenu"
import QuarkProfileEditContext from "./quarkProfileEdit"
import Loader from "./loadingAnimation";
function Main({ setQuarkOrder, quarkOrder, setSelectedQuarkId, selectedQuarkId, userQuarks, setUserQuarks, isAuth, setAuthState, userData, setUserData, api }) {
    let [displayQuarkEditContext, toggleQuarkEditContext] = useState(false);
    let [displayQuarkEditContextData, toggleQuarkEditContextData] = useState({});
    let [displayQuarkServerProfile, toggleQuarkServerProfileContext] = useState(false)
    let [quarkContextMenu, toggleQuarkContextMenu] = useState(false)

    return <div className="main">
        <QuarkList quarkContextMenu={quarkContextMenu} toggleQuarkContextMenu={toggleQuarkContextMenu} displayQuarkEditContextData={displayQuarkEditContextData} toggleQuarkServerProfileContext={toggleQuarkServerProfileContext} toggleQuarkEditContextData={toggleQuarkEditContextData} displayQuarkEditContext={displayQuarkEditContext} toggleQuarkEditContext={toggleQuarkEditContext} setQuarkOrder={setQuarkOrder} quarkOrder={quarkOrder} selectedQuarkId={selectedQuarkId} setSelectedQuarkId={setSelectedQuarkId} userQuarks={userQuarks} setUserQuarks={setUserQuarks} isAuth={isAuth} setAuthState={setAuthState} userData={userData} setUserData={setUserData} api={api} />
        <ChannelList userData={userData} toggleQuarkContextMenu={toggleQuarkContextMenu} quarks={userQuarks} selectedQuarkId={selectedQuarkId} api={api} />
        <ChannelArea />
        {displayQuarkEditContext ? <QuarkEditContext displayQuarkServerProfile={displayQuarkServerProfile} setUserQuarks={setUserQuarks} api={api} displayQuarkEditContextData={displayQuarkEditContextData} toggleQuarkEditContextData={toggleQuarkEditContextData} displayQuarkEditContext={displayQuarkEditContext} toggleQuarkEditContext={toggleQuarkEditContext} /> : <></>}
        {displayQuarkServerProfile ? <QuarkProfileEditContext user={userData} selectedQuarkData={displayQuarkEditContextData} toggleQuarkServerProfileContext={toggleQuarkServerProfileContext} api={api}></QuarkProfileEditContext> : <></>}
    </div>
}







function ChannelList({ toggleQuarkContextMenu, selectedQuarkId, quarks, api, userData }) {
    var [quark, setQuark] = useState(quarks.find(q => q.id == selectedQuarkId))
    var [loading, setLoading] = useState(false)
    var [displayHeaderMenu, toggleHeaderMenu] = useState(false);
    useEffect(() => {
        if (selectedQuarkId == -1 || quarks.length == 0) return
        async function getQuarkChannels() {
            setLoading(true)
            let x = await api.getQuark({ id: selectedQuarkId })
            setQuark(x)
            setLoading(false)
        }
        getQuarkChannels()
    }, [selectedQuarkId, quarks])

    if (loading) return (<div onClick={() => { toggleQuarkContextMenu(false) }} className="channelList"><Loader display={true}></Loader></div>)

    console.log(displayHeaderMenu)
    if (selectedQuarkId == -1 || quarks.length == 0) return
    if (quark == undefined) return;
    return <div className="channelList" onClick={() => { toggleQuarkContextMenu(false) }}>
        <div className="header" onClick={() => { toggleHeaderMenu(displayHeaderMenu ? false : true) }}>
            {displayHeaderMenu ? (<><div className="headerMenu">
                {quark.ownerIds.includes(userData.id) ? <div><h1>Edit server</h1></div> : <></>}
                <div><h1>Copy invite</h1></div>
                {!quark.ownerIds.includes(userData.id) ? <div><h1>Leave server</h1></div> : <></>}
            </div></>) : <></>}
            <h1 className="title">{quark.name}</h1>
        </div>
        <div className="channels" onClick={() => { toggleHeaderMenu(false) }}>
            {quark.channels.map((c, i) => { return <div className="channel" key={i}><p>{c.name}</p></div> })}
        </div>
    </div>
}
function ChannelArea() {
    return <div className="channelArea"></div>
}










export default Main
