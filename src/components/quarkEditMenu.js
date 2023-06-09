import Loader from "./loadingAnimation"
import { useEffect, useState } from 'react';

function QuarkEditMenu({ setUserQuarks, displayQuarkEditContextData, toggleQuarkEditContextData, displayQuarkEditContext, toggleQuarkEditContext, api }) {
    let [selectedOption, setSelectedOption] = useState(0);
    useEffect(() => {
        async function e() {
            let x = await api.getQuark({ id: displayQuarkEditContextData.id })
            toggleQuarkEditContextData(x);
        }
        e()
    }, [])
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
            <Channels index={2} api={api} currentIndex={selectedOption} data={displayQuarkEditContextData} editData={toggleQuarkEditContextData} />
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

    async function makeOwner(e, id) {
        let x = await data.updateQuark({ owners: [...data.ownerIds, id] })
        if (typeof x == 'number') {
            e.target.innerText = `Error: ${x}`;
            e.target.classList.add('error')
            setInterval(() => {
                e.target.classList.remove('error')
                e.target.innerText = `Make owner`;

            }, 5000)
        }
    }
    async function removeOwner(e, id) {
        let owners = [...data.ownerIds]
        owners.splice(owners.indexOf(id), 1)
        let x = await data.updateQuark({ owners: owners })
        if (typeof x == 'number') {
            e.target.innerText = `Error: ${x}`;
            e.target.classList.add('error')
            setInterval(() => {
                e.target.classList.remove('error')
                e.target.innerText = `Make owner`;

            }, 5000)
        }
    }

    if (currentIndex !== index) return;
    return (<>
        <h1 className="title">Members</h1>
        <div className="memberList">{
            displayLoading ? <Loader display={true}></Loader> : members.map((m, i) => { return (<div key={i} className="member"><img src={m.avatar}></img><h1>{m.username}</h1><h2>{m.id}</h2>{data.ownerIds.includes(m.id) ? <button className="red" onClick={(e) => { removeOwner(e, m.id) }}>Remove owner</button> : <button onClick={(e) => { makeOwner(e, m.id) }}>Make owner</button>}</div>) })
        }</div>
    </>
    )
}
function Channels({ index, currentIndex, data, editData, api }) {
    let [selectedChannel, setSelectedChannel] = useState({})
    let [sliderState, setSliderState] = useState(0)
    let [changes, setChanges] = useState({})
    function handleChannelSelect(event, channel) {
        setSelectedChannel({ ...channel })
        setChanges({})
        document.getElementById("name").value = channel.name
        document.getElementById("desc").value = channel.description
        setSliderState(1)
    }
    function unselect() {
        setSliderState(0)
    }
    function handleNameInput(e) {
        if (e.currentTarget.value !== "" && e.currentTarget.value !== selectedChannel.name) setChanges({ ...changes, name: e.currentTarget.value })
        else setChanges({ ...changes, name: null })
    }

    function handleDescInput(e) {
        if (e.currentTarget.value !== "" && e.currentTarget.value !== selectedChannel.description) setChanges({ ...changes, desc: e.currentTarget.value })
        else setChanges({ ...changes, desc: null })
    }
    async function deleteChannel() {
        console.log(selectedChannel)
        let x = await selectedChannel.delete()
        if (x == true) {
            editData(await api.getQuark({ id: data.id }))
            setSelectedChannel({})
            setSliderState(0)
            setChanges({})
        }
    }

    async function newChannel() {
        let x = await data.createChannel({ name: "New Channel" })
        if (typeof x == "number") return //uh oh
        editData(await api.getQuark({ id: data.id }))
        setSelectedChannel(x)
        setSliderState(1)

    }
    async function saveChanges() {
        let x = await selectedChannel.update({ name: changes.name, desc: changes.desc })
        if (x == true) {
            editData(await api.getQuark({ id: data.id }))
            setSelectedChannel(x)
            setSliderState(0)
            setChanges({})
        } else {
            console.log(x)
        }
    }
    if (currentIndex !== index) return;

    return <>
        <h1 className="title">{sliderState == 0 ? "Channels" : selectedChannel.name}</h1>
        <div className={`slider stage-${sliderState}`}>
            <div className="slide channelList">
                <div key="new" className="channel"><h1>New</h1><h2>Create a channel</h2><button className="green" onClick={newChannel}>Create</button></div>
                {data.channels.map((c, i) => { return <div key={i} className="channel"><h1>{c.name}</h1><h2>{c.description || "[No description]"}</h2><button onClick={(e) => { handleChannelSelect(e, c) }}>Edit</button></div> })}
            </div>
            <div className="slide channelEdit">
                <form>
                    <section>
                        <label htmlFor="name">Name:</label>
                        <input autoComplete="off" id="name" placeholder={selectedChannel.name} defaultValue={selectedChannel.name} onInput={handleNameInput}></input>
                    </section>
                    <section>
                        <label htmlFor="desc">Description:</label>
                        <input autoComplete="off" id="desc" placeholder={selectedChannel.description} defaultValue={selectedChannel.description} onInput={handleDescInput}></input>
                    </section>
                </form>
                <button onClick={deleteChannel} className="red">Delete</button>
                <button onClick={unselect}>Back</button>
            </div>

        </div>
        {changes.desc || changes.name ? <div className="saveBar"><h1>Do you want to save your changes?</h1><button onClick={saveChanges}>Save</button></div> : <></>}
    </>
}





export default QuarkEditMenu