import Quark from "./quark.js"
import Channel from "./channel.js"
import Message from "./message.js"
import API from "./api.js"

class User {
    constructor(opts, jwt, baseDomain, wsBaseDomain) {
        this.admin = opts?.admin;
        if (opts?.isBot != undefined) this.isBot = opts.isBot
        if (opts?.email != undefined) this.email = opts.email
        this.username = opts?.username
        this.id = opts?._id
        this.avatar = opts?.avatar || opts?.avatarUri
    }
}

export default User