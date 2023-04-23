import Message from "./message.js"
import Channel from "./channel.js"
import User from "./user.js"
import API from "./api.js"
const baseDomain = "lq.litdevs.org"
const wsBaseDomain = "lq-gateway.litdevs.org"

class Quark {
    constructor(opts, jwt, ws, baseDomain, wsBaseDomain) {
        this.id = opts._id;
        this.name = opts.name;
        this.iconUri = opts.iconUri;
        this.emotes = opts.emotes;
        this.roles = opts.roles;
        this.bans = opts.bans;
        this.invite = opts.invite;
        this.memberIds = opts.members;
        this.channels = opts.channels.map(c => new Channel(c, jwt, ws, baseDomain, wsBaseDomain))
        this.ownerIds = opts.owners
        this.websocket = ws


        Object.defineProperty(this, "delete", {
            enumerable: false,
            writable: true
        });
        Object.defineProperty(this, "createChannel", {
            enumerable: false,
            writable: true
        });
        this.delete = async () => {
            let f = await fetch(`https://${baseDomain}/v1/quark/${this.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            })
            let json = await f.json()
            if (json.request.status_code == 200) {
                return json.response
            } else {
                return json
            }

        }
        this.createChannel = async (data) => {
            let a_t = data?.access_token || jwt
            if (a_t == undefined) return { "error": "please enter a access token" }

            let name = data?.name
            if (name == undefined) return { "error": "please enter a channel name" }

            let f = await fetch(`https://${baseDomain}/v1/channel/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${a_t}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ quark: this.id, name: data.name })
            })
            let json = await f.json()
            if (json.request.status_code == 200) {
                return new Channel(json.response.channel, jwt, ws, baseDomain, wsBaseDomain)
            } else {
                return json
            }
        }
        this.leave = async (data) => {
            let a_t = data?.access_token || jwt
            if (a_t == undefined) return { "error": "please enter a access token" }

            let f = await fetch(`https://${baseDomain}/v1/quark/${this.id}/leave`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${a_t}`,
                },
            })
            let json = await f.json()
            if (json.request.status_code == 200) {
                return true
            } else {
                return json
            }
        }
        this.subscribeUpdates = () => {
            if (this.websocket.rawsocket == undefined) return false;
            var ee = new EventEmitter()

            for (let c of this.channels) {
                this.websocket.rawsocket.send(JSON.stringify({ "event": "subscribe", "message": `channel_${c.id}` }))
            }
            this.websocket.rawsocket.addEventListener("message", (msg) => {
                let data = JSON.parse(msg.data)
                if (data.eventId == "messageCreate" && this.channels.map(c => c.id).includes(data.message.channelId)) {
                    ee.emit("newMessage", { quark: this, message: data })
                }
            })
            return ee

        }
        this.updateQuark = async (data) => {
            let a_t = data?.access_token || jwt
            if (a_t == undefined) return { "error": "please enter a access token" }


            let bodyJson = {}
            if (data.name) bodyJson.name = data.name
            if (data.invite) bodyJson.invite = data.invite
            if (data.owners) bodyJson.owners = data.owners


            let f = await fetch(`https://${baseDomain}/v1/quark/${this.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${a_t}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyJson)
            })
            let json = await f.json()
            if (json.request.status_code == 200) {
                console.log(json.response)
                if (data.name) this.name = data.name
                if (data.invite) this.invite = data.invite
                if (data.owners) this.ownerIds = data.owners
                return json.response
            } else {
                return json.request.status_code
            }
        }
        this.updateIcon = async (data) => {
            let a_t = data?.access_token || jwt
            if (a_t == undefined) return { "error": "please enter a access token" }

            let file = data?.file
            if (file == undefined) return { "error": "please enter a file" }


            let f = await fetch(`https://${baseDomain}/v1/quark/${this.id}/icon
            `, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${a_t}`,
                    "Content-Type": file.type
                },
                body: file
            })
            let json = await f.json()
            if (json.request.status_code == 200) {
                this.iconUri = json.response.icon
                return json.response
            } else {
                return json
            }
        }
    }
}

export default Quark