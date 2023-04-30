import Loader from "./loadingAnimation"
import { useEffect, useState } from 'react';

function QuarkEditMenu({ toggleQuarkServerProfileContext, api, user, selectedQuarkData }) {
    let [selectedOption, setSelectedOption] = useState(0)


    return <div className="fullScreenMenu">
        <div className="menuBar">
            <div className="title"><h1>bruh</h1></div>
            <div className={"option" + (selectedOption == 0 ? " selected" : "")} onClick={() => { setSelectedOption(0) }}><h1 className="title">Nickname</h1></div>

        </div>
        <div className="focusArea">
            <Nickname index={0} currentIndex={selectedOption} api={api} user={user} quarkData={selectedQuarkData} />
        </div>
        <div className="exitButton" onClick={() => { toggleQuarkServerProfileContext(false) }}>
            Exit
        </div>
    </div>
}


function Nickname({ index, currentIndex, api, user, quarkData }) {
    var [nick, setNick] = useState(null)
    let [changes, setChanges] = useState(null)
    useEffect(() => {
        async function getNick() {
            let x = await api.getNick({ id: quarkData.id })
            setNick(x)
        }
        getNick()
    }, [])


    function handleInput(e) {
        if (e.currentTarget.value.length > 0 && e.currentTarget.value !== nick) setChanges(e.currentTarget.value)
        else setChanges(null)
    }
    async function saveChanges() {
        let x = await api.setNick({ nick: changes, id: quarkData.id })
        if (x == true) {
            setNick(changes)
            setChanges(null);
        }
    }


    if (currentIndex !== index) return;
    return <>
        {(changes) ? <div className="saveBar"><h1>Do you want to save your changes?</h1><button onClick={saveChanges}>Save</button></div> : <></>}
        <h1 className="title">Nickname</h1>
        <div className="nameContainer">
            <form>
                <section>
                    <label htmlFor="serverNameInput">Server nickname</label>
                    <input id="quarkNicknameInput" type="text" onInput={handleInput} placeholder={nick || "Loading..."} defaultValue={nick}></input>
                </section>
            </form>
        </div>
    </>
}







export default QuarkEditMenu