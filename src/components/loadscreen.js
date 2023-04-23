import piss from '../piss.png';
import { useEffect, useState } from 'react'
import React from 'react'

function LoadingCover({ state, setState, hide, setHide, text }) {
    let loadingScreenTips = [
        (<><h2>Tip:</h2><h2>When you loose the game you don't win!</h2></>),
        (<><h2>Did you know:</h2><h2>Press 'send' to send a message!</h2></>),
        (<><h2>Tip:</h2><h2>Tips are shown in the loading screen!</h2></>),
        (<><h2>Fact:</h2><h2>Pisscord isn't actually Discord</h2></>),
        (<><h2>Fact:</h2><h2>You are now manually breathing</h2></>),
        (<><h2>Tip:</h2><h2>Pisscord needs an internet connection</h2></>),
        (<><h2>Did you know:</h2><h2>You can't spell Pisscord without "piss" or "cord."</h2></>),
        (<><h2>Tip:</h2><h2>Pisscord is not a substitute for therapy.</h2></>),
        (<><h2>Did you know:</h2><h2>Pisscord is not actually made of piss!</h2></>),
        (<><h2>Tip:</h2><h2>Please refrain from sending unsolicited pictures of your pet rock on Pisscord.</h2></>),
        (<><h2>Fact:</h2><h2>Pisscord is not a recommended substitute for actual social interaction</h2></>),
        (<><h2>Tip:</h2><h2>Do not use Pisscord while operating heavy machinery</h2></>),
        (<><h2>Pisscord:</h2><h2>the chat app that's just as dysfunctional as your real life friends.</h2></>),
        (<><h2>Did you know:</h2><h2>Pisscord is not liable for any emotional or physical harm caused by excessive use of emojis.</h2></>),
        (<></>),

    ]
    let [tip, setTip] = useState(loadingScreenTips[Math.floor(Math.random() * (loadingScreenTips.length - 1))])


    useEffect(() => {
        setInterval(() => {
            setTip(loadingScreenTips[Math.floor(Math.random() * (loadingScreenTips.length - 1))])
        }, 7000);
    }, [])

    if (state == false) return;

    return <div className={"fullScreenLoad" + (hide ? " hide" : "")}>
        <img src={piss}></img>
        <div className="loadingScreenTips">
            {text ? text : tip}
        </div>
    </div>
}

export default LoadingCover