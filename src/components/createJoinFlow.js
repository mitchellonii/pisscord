import { useState } from 'react'
import Loader from "./loadingAnimation"

export function CreateFlow({ show, toggleShow, api, setUserQuarks, setOrder }) {
    let [showLoadBox, toggleLoadBox] = useState(false)
    let [buttonDisabled, toggleButton] = useState(false);
    let [canvas, showCanvas] = useState(false);
    let [additionalText, setAdditionalText] = useState(null)
    function hideFlow(e) {
        if (e.target != e.currentTarget) return
        e.target.style.opacity = 0
        setTimeout(() => {
            toggleShow(false)
        }, 200)
    }

    function handleFileInput(e) {
        let label = document.querySelector(".labelBlock#label")
        if (e.target.files.item(0) == null) {
            label.innerText = "Click to upload..."
            showCanvas(false);
            return
        }
        let file = e.target.files.item(0).name
        label.innerText = file;
        showCanvas(true)
        let canvas = document.getElementById("iconDisplay")
        let ctx = canvas.getContext("2d")

        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files.item(0));

    }

    async function handleCreate(e) {
        let name = document.getElementById("name").value || undefined
        let file = document.getElementById("file").files.item(0) || undefined
        let invite = document.getElementById("invite").value || undefined;
        if (name == undefined || name.length == 0) return setAdditionalText("Please specify a name")
        toggleLoadBox(true)
        setAdditionalText(null)
        let nq = await api.createQuark({ name: name })
        if (nq !== undefined && nq.id !== undefined) {
            let qData = await Promise.all([nq.updateQuark({ id: nq.id, invite: invite }), nq.updateIcon({ file: file })])
            let data = await Promise.all([api.getMyQuarks(), api.getQuarkOrder()])
            toggleLoadBox(false);
            toggleShow(false);
            setOrder(data[1])
            setUserQuarks(data[0])
        } else {
            //ruh roh
        }
    }

    var lastText = null;
    function handleInput(e) {
        console.log(e.target.value)
        if (e.target.value == "") return
        lastText = e.target.value
        let text = e.target.value
        setTimeout(async () => {
            if (text == lastText) {
                toggleLoadBox(true)
                setAdditionalText("Checking invite...");
                try {
                    let x = await api.checkInvite({ invite: text })
                    toggleLoadBox(false)
                    if (x !== true) {
                        setAdditionalText("")
                        toggleButton(false);
                    } else {
                        setAdditionalText("Invite already in use!");
                        toggleButton(true);
                    }
                } catch (e) {
                    toggleLoadBox(false);
                    setAdditionalText("Unexpected error, try again later")
                }
            }
        }, 700)
    }



    if (!show) return
    return <div className="fullScreenShade" onClick={hideFlow}>
        <div className="createPopup">
            <h1>Pisscord</h1>
            <h2>Fill in the prompts to create a server</h2>
            <form>
                <section>
                    <label htmlFor="name">Name:</label>
                    <input id="name" autoComplete="off"></input>
                </section>
                <section>
                    <label htmlFor="label">Icon (optional):</label>
                    <label htmlFor="file" className="labelBlock" id="label">Click to upload...</label>
                    <input id="file" type="file" accept="image/png, image/jpeg, image/webp" onInput={handleFileInput}></input>
                    <div className="canvasCotainer" hidden={canvas ? false : true}><div className="overlay"></div><canvas id="iconDisplay"></canvas></div>
                </section>
                <section>
                    <label htmlFor="invite">Invite code (optional):</label>
                    <input id="invite" onInput={handleInput}></input>
                </section>
            </form>
            {(additionalText !== null ? <h2>{additionalText}</h2> : <></>)}
            <button disabled={buttonDisabled} hidden={showLoadBox} className="submit" onClick={handleCreate}>Create</button>
            <Loader display={showLoadBox} />
        </div>
    </div>
}

export function JoinFlow({ show, toggleShow, api, setUserQuarks, setOrder }) {
    var [buttonDisabled, setButtonDisabled] = useState(true)
    var [showLoader, toggleLoader] = useState(false);
    var [codeState, setCodeState] = useState(0);
    var [additionalText, setAdditionalText] = useState(null);
    function hideFlow(e) {
        setAdditionalText(null)
        setButtonDisabled(true);
        setCodeState(0)
        if (e.target != e.currentTarget) return
        e.target.style.opacity = 0
        setTimeout(() => {
            toggleShow(false)
        }, 200)
    }

    async function handleFormSubmit(e) {
        e.preventDefault()
        let code = document.getElementById("invite").value;
        setButtonDisabled(true);
        toggleLoader(true)
        let x = await api.joinInvite({ invite: code })
        if (x !== true) {
            setAdditionalText(x)
            setButtonDisabled(false)
            setCodeState(-1)
            toggleLoader(false)
        }
        else {
            let data = await Promise.all([api.getMyQuarks(), api.getQuarkOrder()])
            setUserQuarks(data[0])
            setOrder(data[1])
            setButtonDisabled(true)
            toggleLoader(false);
            setCodeState(0);
            setAdditionalText(null);
            toggleShow(false)
        }
    }

    var lastText = null;
    function handleInput(e) {
        if (document.getElementById("invite").value == "") return
        let text = document.getElementById("invite").value;
        lastText = document.getElementById("invite").value;
        setTimeout(async () => {
            if (text == lastText) {
                setButtonDisabled(true)
                toggleLoader(true)
                setAdditionalText(null);
                try {
                    let x = await api.checkInvite({ invite: text })
                    toggleLoader(false)
                    if (x == true) {
                        setButtonDisabled(false)
                        setCodeState(1)
                        setAdditionalText(null)
                    } else {
                        setButtonDisabled(true)
                        setCodeState(-1)
                        setAdditionalText("Invalid invite");
                    }
                } catch (e) {
                    toggleLoader(false);
                    setCodeState(-1)
                    setAdditionalText("Unexpected error, try again later")
                    setButtonDisabled(true);
                }
            }
        }, 700)
    }

    var inputColor;
    switch (codeState) {
        case -1:
            inputColor = "red"
            break;
        case 0:
            inputColor = ""
            break;
        case 1:
            inputColor = "green"
    }

    if (!show) return;
    return <div className="fullScreenShade" onClick={hideFlow}>
        <div className="joinPopup">
            <h1>Pisscord</h1>
            <h2>Insert invite code to join a server</h2>
            <p></p>
            <form onSubmit={handleFormSubmit}>
                <section>
                    <input maxLength={420} id="invite" className={inputColor} onInput={handleInput} placeholder="litdevs"></input>
                </section>
            </form>
            {additionalText !== null ? <h3>{additionalText}</h3> : <></>}
            <Loader display={showLoader} />
            <button disabled={buttonDisabled ? true : false} hidden={buttonDisabled ? true : false} id="joinServerButton" onClick={handleFormSubmit}>Join</button>
        </div>
    </div>
}
