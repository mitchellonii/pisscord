import Loader from "./loadingAnimation"
import { useEffect, useState } from 'react';

function QuarkEditMenu({ setUserQuarks, displayQuarkEditContextData, toggleQuarkEditContextData, displayQuarkEditContext, toggleQuarkEditContext, api }) {
    let [selectedOption, setSelectedOption] = useState(0);
    if (!displayQuarkEditContext) return;
    return <div className="fullScreenMenu">
        <div className="menuBar">
            <div className="title"><h1>{displayQuarkEditContextData.name.toUpperCase()}</h1></div>
            <div className={"option" + (selectedOption == 0 ? " selected" : "")} onClick={() => { setSelectedOption(0) }}><h1 className="title">Overview</h1></div>
            <div className={"option" + (selectedOption == 1 ? " selected" : "")} onClick={() => { setSelectedOption(1) }}><h1 className="title">Members</h1></div>
            <div className={"option" + (selectedOption == 2 ? " selected" : "")} onClick={() => { setSelectedOption(2) }}><h1 className="title">Channels</h1></div>
        </div>
        <div className="focusArea">
            <Overview index={0} setUserQuarks={setUserQuarks} currentIndex={selectedOption} data={displayQuarkEditContextData} api={api} setData={toggleQuarkEditContextData} />
            <Members index={1} currentIndex={selectedOption} data={displayQuarkEditContextData} api={api} />
            <Channels index={2} currentIndex={selectedOption} data={displayQuarkEditContextData} />
        </div>
        <div className="exitButton" onClick={() => { toggleQuarkEditContext(false) }}>
            Exit
        </div>
    </div>
}


function Overview({ index, currentIndex, data, api, setData, setUserQuarks }) {

    let [changes, setChanges] = useState({ icon: null, invite: null, name: null })

    function handleFileInput(e) {
        if (e.currentTarget.files.item(0) !== null) {
            setChanges({ ...changes, icon: e.currentTarget.files.item(0) })
            var reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById("serverIconDisplay").src = event.target.result;
            }
            reader.readAsDataURL(e.currentTarget.files.item(0));
        } else {
            setChanges({ ...changes, icon: null })
            document.getElementById("serverIconDisplay").src = data.iconUri
        }
    }
    function handleNameInput(e) {
        if (e.currentTarget.value.length >= 1) setChanges({ ...changes, name: e.currentTarget.value })
        if (data.name == e.currentTarget.value || e.currentTarget.value == "") setChanges({ ...changes, name: null })
    }
    function handleInviteInput(e) {
        if (e.currentTarget.value.length >= 1) setChanges({ ...changes, invite: e.currentTarget.value })
        if (data.invite == e.currentTarget.value || e.currentTarget.value == "") setChanges({ ...changes, invite: null })

    }


    async function saveChanges() {
        if (changes.icon) {
            let x = await data.updateIcon({ file: changes.icon })
            setChanges({ ...changes, icon: null })

        }
        if (changes.invite) {
            let y = await data.updateQuark({ invite: changes.invite })
            setChanges({ ...changes, invite: null })
        }
        if (changes.name) {
            let y = await data.updateQuark({ name: changes.name })
            setChanges({ ...changes, name: null })
        }

    }


    if (currentIndex !== index) return;
    return <>
        {(changes.icon || changes.invite || changes.name) ? <div className="saveBar"><h1>Do you want to save your changes?</h1><button onClick={saveChanges}>Save</button></div> : <></>}
        <h1 className="title">Server Overview</h1>
        <div className="iconContainer">
            <img src={data.iconUri} id="serverIconDisplay"></img>
            <h3>Minimum size: <b>1x1</b></h3>
            <h2>We recommend an image of at least 512x512 for the server</h2>
            <form>
                <section>
                    <label htmlFor="file" className="labelBlock" id="label">Upload image</label>
                    <input hidden id="file" type="file" accept="image/png, image/jpeg, image/webp" onInput={handleFileInput} ></input>

                </section>
            </form>

        </div>
        <div className="nameContainer">
            <form>
                <section>
                    <label htmlFor="serverNameInput">Server name</label>
                    <input id="serverNameInput" type="text" onInput={handleNameInput} placeholder={data.name} defaultValue={data.name}></input>
                </section>
            </form>
        </div>
        <div className="break"></div>
        <div className="inviteContainer">
            <form>
                <section>
                    <label htmlFor="serverNameInput">Server invite</label>
                    <input id="serverNameInput" type="text" onInput={handleInviteInput} placeholder={data.invite} defaultValue={data.invite}></input>
                </section>
            </form>
        </div>

    </>
}





function Members({ index, currentIndex, data, api }) {
    var [members, setMembers] = useState([])
    var [displayLoading, toggleLoading] = useState(false)

    useEffect(() => {
        async function e() {
            toggleLoading(true)
            var tempList = []
            for (let id of data.memberIds) {
                var e = await api.getUserInfo({ id: id })
                tempList.push(e)
            }
            setMembers([...tempList])
            toggleLoading(false)
        }
        e()
    }, [])

    if (currentIndex !== index) return;
    return (<>
        <h1 className="title">Members</h1>
        <div className="memberList">{
            displayLoading ? <Loader display={true}></Loader> : members.map((m, i) => { return (<div key={i}>{JSON.stringify(m)}</div>) })
        }</div>
    </>
    )
}
function Channels({ index, currentIndex, data }) {
    if (currentIndex !== index) return;
    return <>Channels</>
}





export default QuarkEditMenu