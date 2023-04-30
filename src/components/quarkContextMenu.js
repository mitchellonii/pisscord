function QuarkContextMenu({ toggleQuarkServerProfileContext, displayQuarkEditContextData, toggleQuarkEditContextData, displayQuarkEditContext, toggleQuarkEditContext, toggleLoaderBox, setUserQuarks, setOrder, pos, shown, toggle, data, order, api, userData }) {
    if (!shown) return;
    async function moveUp(e) {
        let index = order.indexOf(data.id)
        if (index !== 0) {
            [order[index - 1], order[index]] = [order[index], order[index - 1]];
            setOrder(order);
            await api.setQuarkOrder({ order: order })
        }
    }
    async function moveDown(e) {
        let index = order.indexOf(data.id)
        if (order.length - index !== 1) {
            [order[index + 1], order[index]] = [order[index], order[index + 1]];
            setOrder(order);
            await api.setQuarkOrder({ order: order })
        }
    }

    async function leave(e) {
        toggleLoaderBox(true)
        await data.leave()
        let y = await api.getMyQuarks()
        order.splice(order.indexOf(data.id), 1)
        setOrder(order)
        setUserQuarks(y)
        toggleLoaderBox(false)
    }

    async function deleteQuark(e) {
        toggleLoaderBox(true)
        await data.delete()
        let y = await api.getMyQuarks()
        order.splice(order.indexOf(data.id), 1)
        setOrder(order)
        setUserQuarks(y)
        toggleLoaderBox(false)
    }
    async function editQuark(e) {
        toggleQuarkEditContextData(data);
        toggleQuarkEditContext(true)
    }
    function handleInvite(e) {
        navigator.clipboard.writeText(data.invite);
    }

    function handleServerProfile() {
        toggleQuarkEditContextData(data);

        toggleQuarkServerProfileContext(true);
    }
    return <div className="contextMenu" style={{ top: pos.y, left: pos.x }}>
        <div onClick={handleInvite}><a>Copy invite</a></div>
        <div onClick={handleServerProfile}><a>Edit server profile</a></div>
        {
            (order.indexOf(data.id) !== 0 ? <div onClick={moveUp}><a>Move up</a></div> : "")
        }
        {
            (order.length - order.indexOf(data.id) !== 1 ? <div onClick={moveDown}><a>Move down</a></div> : "")
        }
        {
            (data.ownerIds.includes(userData.id) ? <><div onClick={editQuark}><a>Edit</a></div><div onClick={deleteQuark}><a>Delete</a></div></> : <div onClick={leave}><a>Leave</a></div>)
        }
    </div >
}


export default QuarkContextMenu