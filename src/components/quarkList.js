import { useState } from 'react'
import piss from "../piss.png"

import { JoinFlow, CreateFlow } from './createJoinFlow'
import QuarkContextMenu from './quarkContextMenu'
import LoadingBox from './fullscreenLoad'
function QuarkList({ displayQuarkEditContextData, toggleQuarkEditContextData, displayQuarkEditContext, toggleQuarkEditContext, setQuarkOrder, quarkOrder, setSelectedQuarkId, selectedQuarkId, userQuarks, setUserQuarks, isAuth, setAuthState, userData, setUserData, api }) {

    let [quarkContextMenu, toggleQuarkContextMenu] = useState(false)
    let [selectedQCM, setSelectedQCM] = useState({})
    let [contextMenuPos, setCMPos] = useState({ x: -1, y: -1 })
    let [joinPopup, toggleJoinPopup] = useState(false);
    let [createPopup, toggleCreatePopup] = useState(false);
    let [showLoadBox, toggleLoaderBox] = useState(false);
    function handleRightClick(e, quark) {
        toggleQuarkContextMenu(true);
        setSelectedQCM(quark)
        setCMPos({ x: e.clientX + 2, y: e.clientY + 2 })
        e.preventDefault()
    }

    function selectQuark(e, quark) {
        e.preventDefault()
        setSelectedQuarkId(quark.id)
    }

    function joinServer() {
        toggleJoinPopup(true)
    }
    function createServer() {
        toggleCreatePopup(true)
    }

    var things = userQuarks.filter(q => quarkOrder.includes(q.id))

    return <div className="navBar" onClick={(e) => { toggleQuarkContextMenu(false) }}>
        <div className="home"><div className="indicator"></div><div className="container"><img src={piss}></img></div></div>
        <div className="br"><div></div></div>
        {
            quarkOrder.map((q, i) => {
                var quark;
                if (things.length == quarkOrder.length) quark = userQuarks.find(e => { return e.id == q })
                else quark = userQuarks[i];
                return (
                    <div onContextMenu={(e) => { handleRightClick(e, quark) }} className={"quark" + (selectedQuarkId == quark.id ? " selected" : "")} key={quark.id}>
                        <div className="indicator"></div>
                        <div className="container" >
                            <img src={quark.iconUri} onClick={(e) => { selectQuark(e, quark) }} />
                        </div>
                        <div className="serverName" style={{ top: `${(90 + i * 60)}px` }}>
                            <h1>{quark.name}</h1>
                        </div>
                    </div>)
            })
        }
        <div className="join" onClick={joinServer}>
            <div className="indicator"></div>
            <div className="container">
                <div className="bg">
                    <svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path d="M12 10.9C11.39 10.9 10.9 11.39 10.9 12C10.9 12.61 11.39 13.1 12 13.1C12.61 13.1 13.1 12.61 13.1 12C13.1 11.39 12.61 10.9 12 10.9ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.19 14.19L6 18L9.81 9.81L18 6L14.19 14.19Z"></path></svg>
                </div>
            </div>
        </div>
        <div className="create" onClick={createServer}>
            <div className="indicator"></div>
            <div className="container">
                <div className="bg">
                    <svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"></path></svg>
                </div>
            </div>
        </div>

        <QuarkContextMenu displayQuarkEditContextData={displayQuarkEditContextData} toggleQuarkEditContextData={toggleQuarkEditContextData} displayQuarkEditContext={displayQuarkEditContext} toggleQuarkEditContext={toggleQuarkEditContext} toggleLoaderBox={toggleLoaderBox} setUserQuarks={setUserQuarks} userData={userData} api={api} pos={contextMenuPos} shown={quarkContextMenu} toggle={toggleQuarkContextMenu} data={selectedQCM} order={quarkOrder} setOrder={setQuarkOrder} />
        <JoinFlow show={joinPopup} toggleShow={toggleJoinPopup} api={api} setUserQuarks={setUserQuarks} setOrder={setQuarkOrder} />
        <CreateFlow show={createPopup} toggleShow={toggleCreatePopup} api={api} setUserQuarks={setUserQuarks} setOrder={setQuarkOrder} />
        <LoadingBox show={showLoadBox} />
    </div>
}


export default QuarkList