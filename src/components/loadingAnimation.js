function Loader({ display }) {
    if (display == false) return
    return <div className="loader">
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
}


export default Loader