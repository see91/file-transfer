import {requisiteQueryData} from "@/unlinkagent/types";
import {encodeRequestData} from "@/unlinkagent/api/encodeRequestData";
import { storage } from "@/utils/storage";
import { v4 as uuidv4 } from 'uuid'
import {nulink_agent_config} from "@/unlinkagent/config";

export const connect = async (callback:Function) => {

    await localStorage.clear()
    const uuid = uuidv4();
    await localStorage.setItem("uuid", uuid)
    const queryData: requisiteQueryData = {
        accountAddress: "", accountId: "",
        redirectUrl: document.location.toString(),
        sourceUrl: document.domain
    }
    const userInfo = storage.getItem("userinfo");
    if (userInfo){
        const user = JSON.parse(userInfo)
        queryData.accountAddress = user.accountAddress
        queryData.accountId = user.accountAddress
        const publicKey = user.publicKey
        if (publicKey) {
            const paramData = encodeRequestData(queryData, uuid)
            const key = encodeRequestData(uuid, publicKey)
            window.open(nulink_agent_config.address + "&data=" + encodeURIComponent(paramData) + "&key=" + encodeURIComponent(key))
        }
    } else {
        window.open(nulink_agent_config.address + "&sourceUrl=www.127.0.0.1:8090&redirectUrl=" + document.location.toString())
    }
    window.addEventListener("message", callback())
}
