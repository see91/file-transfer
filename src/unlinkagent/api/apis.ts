import {nulink_agent_config} from "@/unlinkagent/config";
import storage from "../../utils/storage";
import {ApplyInfo, applyRequestData, approveRequestData, decryptionRequestData, requisiteQueryData} from "../types";
import {getData} from "../../utils/ipfs";
import {getKeyPair, privateKeyDecrypt, publicKeyEncrypt} from "@/unlinkagent/api/rsautil";
import {encrypt, decrypt} from "@/unlinkagent/api/passwordEncryption";
import { decrypt as aesDecryt } from "@/utils/crypto";

export const cache_user_key: string = "userinfo";

export const connect = async () => {
    window.open(nulink_agent_config.address + "?redirectUrl=" + document.location.toString())
    window.addEventListener("message", loginSuccessHandler)
}

const loginSuccessHandler = async (e) => {
    const date = e.data
    if (date) {
        if (date.action == 'login' && date.result == 'success') {
            await storage.setItem(cache_user_key, date);
            window.removeEventListener("message", loginSuccessHandler)
            window.location.reload()
        }
    }
}

export const checkReLogin = async (responseData) => {
    if (responseData && responseData.subAction && responseData.subAction == "relogin") {
        const userInfo = {
            accountAddress: responseData.accountAddress,
            accountId: responseData.accountId
        };
        storage.setItem(cache_user_key, JSON.stringify(userInfo));
    }
}

export const upload = async () => {
    const userInfo = await storage.getItem(cache_user_key);
    if (!!userInfo){
        const queryData: requisiteQueryData = {
            accountAddress: userInfo.accountAddress,
            accountId: userInfo.accountId,
            redirectUrl: document.location.toString()
        };
        window.open(
            nulink_agent_config.address + "/upload-file?from=outside&data=" +
            encodeURIComponent(JSON.stringify(queryData)))
    } else {
        window.open(nulink_agent_config.address + "/upload-file?from=outside");
    }
    window.addEventListener("message", uploadSuccessHandler);
}

const uploadSuccessHandler = async (e) => {
    const responseData = e.data;
    if (responseData) {
        await checkReLogin(responseData)
        if (responseData.action == "upload" && responseData.result == "success") {
            window.location.reload();
        }
    }
};

export const apply = async (applyInfo: ApplyInfo) => {
    const userInfo = storage.getItem(cache_user_key);
    const agentAccountAddress = userInfo.accountAddress;
    const agentAccountId = userInfo.accountId;
    if (agentAccountAddress && agentAccountId) {
        const applyParam: applyRequestData = {
            accountAddress: agentAccountAddress,
            accountId: agentAccountId,
            redirectUrl: document.location.toString(),
            fileName: applyInfo.fileName,
            fileId: applyInfo.fileId,
            owner: applyInfo.fileCreatorAddress,
            user: userInfo.accountAddress,
            days: applyInfo.usageDays,
        };
        window.open(
            nulink_agent_config.address + "/request-files?from=outside&data=" +
            encodeURIComponent(JSON.stringify(applyParam))
        );
        window.addEventListener("message", applySuccessHandler);
    } else {
        throw new Error("Unlink user information not found, please log in first")
    }
}

const applySuccessHandler = async (e) => {
    const responseData = e.data;
    if (responseData) {
        await checkReLogin(responseData)
        if (responseData.action == "apply" && responseData.result == "success") {
            window.removeEventListener("message", applySuccessHandler);
            window.location.reload();
        }
    }
}

export const approve = async (applyId, userAccountId, currentRecord) => {

    const userInfo = storage.getItem("userinfo");
    const agentAccountAddress = userInfo.accountAddress;
    const agentAccountId = userInfo.accountId;
    if (agentAccountAddress && agentAccountId) {
        const approveParam: approveRequestData = {
            accountAddress: agentAccountAddress,
            accountId: agentAccountId,
            userAccountId,
            redirectUrl: document.location.toString(),
            sourceUrl: document.domain,
            from: agentAccountAddress,
            to: currentRecord.proposer_address,
            applyId: applyId,
            days: currentRecord.days,
            remark :currentRecord.remark
        };

        window.open(
            nulink_agent_config.address + "/approve?from=outside&data=" +
            encodeURIComponent(JSON.stringify(approveParam))
        );
        window.addEventListener("message", approveSuccessHandler);
    } else {
        //TODO turn to unlink agent login page
        return;
    }
};


const approveSuccessHandler = async (e) => {
    const responseData = e.data;
    if (responseData) {
        await checkReLogin(responseData)
        if (responseData.action == "approve") {
            window.removeEventListener("message", approveSuccessHandler);
            alert("Approve Success!");
            window.location.reload();
        }
    }
};

export const download = async (detailItem) => {

    const keypair = getKeyPair()
    const publicKey = keypair.publicKey
    const encryptedKeypair = encrypt(JSON.stringify(keypair));
    await localStorage.setItem('encryptedKeypair', encryptedKeypair)
    const userInfo = storage.getItem("userinfo");
    const agentAccountAddress = userInfo.accountAddress
    const agentAccountId = userInfo.accountId

    if (agentAccountAddress && agentAccountId){
        const decryptionRequestData: decryptionRequestData = {
            accountAddress: agentAccountAddress,
            accountId: agentAccountId,
            redirectUrl: document.location.toString(),
            fileId: detailItem.file_id,
            fileName: detailItem.file_name,
            from: agentAccountAddress,
            to: detailItem.proposer_address,
            publicKey: publicKey
        }
        window.open(nulink_agent_config.address + "/request-authorization?from=outside&data=" + encodeURIComponent(JSON.stringify(decryptionRequestData)))
        window.addEventListener("message", authorizationSuccessHandler)
    }
};

const authorizationSuccessHandler = async (e) => {
    try {
        const responseData = e.data
        const encryptedKeypair = await localStorage.getItem('encryptedKeypair')
        if (!!encryptedKeypair){
            const keypair = JSON.parse(decrypt(encryptedKeypair))
            const _privateKey = keypair.privateKey
            const _publicKey = keypair.publicKey
            const ciphertext = publicKeyEncrypt(_publicKey, 'qwerty')
            const plaintext = privateKeyDecrypt(_privateKey, ciphertext)
            const secret = privateKeyDecrypt(_privateKey, responseData.key)
            const response = JSON.parse(aesDecryt(responseData.data, secret))
            if (response) {
                await checkReLogin(response)
                if (response.action == 'decrypted' && response.result == 'success') {
                    if (!!response && response.url){
                        const arraybuffer = await getData(decodeURIComponent(response.url))
                        const blob = new Blob([arraybuffer], {type: "arraybuffer"});
                        let url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.style.display = "none";
                        link.href = url;
                        link.setAttribute("download",response.fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    window.removeEventListener("message", authorizationSuccessHandler)
                }
            }
        } else {
            throw new Error("Key pair does not exist")
        }
    } catch (error){
        throw new Error("Decryption failed, Please try again")
    }
}


