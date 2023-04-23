import Loader from "./loadingAnimation"


function LoadingBox({ show }) {
    if (!show) return;
    return <div className="fullScreenShade">
        <div className="joinPopup">
            <Loader display={true} />
        </div>
    </div >
}


export default LoadingBox