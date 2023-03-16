import "@/assets/style/header.less";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAvatarImage } from "@/utils/defaultImage";
import { cache_user_key } from '@/features/auth/api/getLoginedUserInfo'

import {
  getAvatarBase64String,
  getUserInfo,
} from "@/features/auth/api/getLoginedUserInfo";
import { setIPFSNodeUrl } from "@/utils/ipfs";
import { repeatInterval } from "@/utils/repeatInterval";
import Emitter from "@/lib/emitter";
import { USERINFO_UPDATE } from "@/lib/emitter-events";
import { getUserDetailInfo } from "@/features/auth/api/getLoginedUserInfo";
import Notice from "./Notice";
import {requisiteQueryData} from "@/unlinkagent/types";
import {encodeRequestData} from "@/unlinkagent/api";

export const Header = ({ setLoginUser, setLoginStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(defaultAvatarImage);
  const [activityKey, setActivityKey] = useState("1");
  const [user, setUser] = useState<any>();
  const [name, setName] = useState<any>("account1");

  const tabClick = (key) => {
    const path = key === "1" ? "/find" : key;
    navigate(path);
    setActivityKey(key);
  };
  const gotoConnect = async () => {
    const uuid = crypto.randomUUID();
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
        window.open("http://localhost:3000?from=outside&data=" + encodeURIComponent(paramData) + "&key=" + encodeURIComponent(key))
      }
    } else {
      window.open("http://localhost:3000?from=outside&sourceUrl=www.127.0.0.1:8090&redirectUrl=" + document.location.toString())
    }
    window.addEventListener("message", loginSuccessHandler)
  };

  const loginSuccessHandler = async (e) => {
      const date = JSON.parse(e.data)
      const redirectUrl = date.redirectUrl
      if (date && redirectUrl /*&& redirectUrl == document.location.toString()*/) {
        if (date.action == 'login' && date.result == 'success') {
          storage.setItem(cache_user_key, date);
          window.removeEventListener("message", loginSuccessHandler)
          window.location.reload()
        }
      }
  }

  const fetchUserInfo = async () => {
    // console.log("fetchUserInfo -------------");
    let user;
    try {
      user = await getUserInfo();
    } catch (error) {
      //1: login failed //2: login success
      setLoginStatus(1);
      console.error(error);
    }

    if (!!user) {
      setUser(user);
      setLoginUser(user);
      setIPFSNodeUrl('/ip4/8.219.11.39/tcp/5001');
      // setIPFSNodeUrl(user.ipfs);
      setName(user.name);
      //1: login failed //2: login success
      setLoginStatus(2);

      const userDetailInfo = await getUserDetailInfo();
      if (!!userDetailInfo.avatar) {
        const avatarStr = await getAvatarBase64String(userDetailInfo.avatar);
        if (!!avatarStr) {
          setAvatar(avatarStr);
        }
      }
    } else {
      setUser(null);
      setLoginUser(null);
      //1: login failed //2: login success
      setLoginStatus(1);
    }

    return user;
  };

  useEffect(() => {
    Emitter.on(USERINFO_UPDATE, async (userinfo) => {
      if (!userinfo) {
        return;
      }
      if (!!userinfo.avatar) {
        // update the avatar
        setAvatar(userinfo.avatar);
      }

      if (!!userinfo.name) {
        // update the nickname
        setName(userinfo.name);
      }

      //re fetch UserInfo
      await fetchUserInfo();
    });

    console.log("header.tsx useEffect -------------");
    repeatInterval(async () => await fetchUserInfo(), {
      repeatNumber: 5,
    });

    return () => {
      Emitter.off(USERINFO_UPDATE, () => {});
    };
  }, []); //remove [navigate], when it url changed,  don't reload the header => don't reload the user unless you refresh the page with F5

  return (
    <div className="header">
      <div className="header_title">
        <a href="https://nulink.org" target="_blank">
          <svg
            width="122"
            height="33"
            viewBox="0 0 122 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="2.81004"
              height="33"
              transform="matrix(-1 0 0 1 26.7681 0)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="14.1223"
              transform="matrix(4.37114e-08 1 1 -4.37114e-08 1.40625 0)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="28.2085"
              transform="matrix(-1 0 0 1 21.9766 0)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="33"
              transform="matrix(-1 0 0 1 2.81055 0)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="28.2085"
              transform="matrix(-1 0 0 1 7.60205 4.7915)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="23.417"
              transform="matrix(-1 0 0 1 12.3931 4.7915)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="28.2085"
              transform="matrix(-1 0 0 1 17.1846 0)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="7.5655"
              transform="matrix(4.37114e-08 1 1 -4.37114e-08 4.82764 4.7915)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="7.5655"
              transform="matrix(4.37114e-08 1 1 -4.37114e-08 14.4111 25.3984)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="2.81004"
              transform="matrix(4.37114e-08 1 1 -4.37114e-08 19.166 25.3984)"
              fill="white"
            />
            <rect
              width="2.81004"
              height="16.572"
              transform="matrix(4.37114e-08 1 1 -4.37114e-08 9.58398 30.1899)"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M46.372 8.75439V19.5604L38.5527 8.75439H35.7202V24.2817H38.5527V13.4757L46.372 24.2817H49.2044V8.75439H46.372Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M63.9417 8.75439V22.6333H56.1225V8.75439H53.29V24.2817H66.7743V8.75439H63.9417Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M70.043 8.75439V24.2817H80.2846L81.0755 22.6333H72.9228V8.75439H70.043Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M83.1182 24.2817H85.9785V8.75439H83.1182V24.2817Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M101.125 8.75439V19.5604L93.3057 8.75439H90.4731V24.2817H93.3057V13.4757L101.125 24.2817H103.957V8.75439H101.125Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M117.657 8.75439L112.669 15.5921H110.037V8.75439H107.227V24.2817H110.037V17.2404H112.669L117.815 24.2817H121.12L115.321 16.4061L120.922 8.75439H117.657Z"
              fill="white"
            />
          </svg>
        </a>
      </div>
      <div className="header_tab">
        <div
          className={activityKey === "1" ? "activity" : ""}
          onClick={() => tabClick("1")}
        >
          {t<string>("header-a-tab-1")}
          <div className="line"></div>
        </div>
        {/* <div
          className={activityKey === "faucet" ? "activity" : ""}
          onClick={() => tabClick("faucet")}
        >
          {t<string>("header-a-tab-3")}
          <div className="line"></div>
        </div> */}
        {/* <div
          className={activityKey === "ranking-list" ? "activity" : ""}
          onClick={() => tabClick("ranking-list")}
        >
          {t<string>("header-a-tab-4")}
          <div className="line"></div>
        </div> */}
        {/* <div
          className={activityKey === "2" ? "activity" : ""}
          onClick={() => tabClick("2")}
        >
          {t<string>("header-a-tab-2")}
          <div className="line"></div>
        </div> */}
        {/* Removed language switching (internationalization support) */}
        {/* <div className="flex_row">
          <GlobalOutlined
            style={{ fontSize: "20px", color: "#eee", marginRight: "8px" }}
          />
          {t<string>("header-a-btn-1")}
        </div> */}
        {user ? (
          <div
            className="user_box flex_row"
            onClick={() => {
              navigate("/memberCenter");
            }}
          >
            {name}
            <div className="user_img">
              <div
                className="user_img_item"
                style={{ background: `url(${avatar})` }}
              />
            </div>
          </div>
        ) : (
          <div className="tab_btn" onClick={gotoConnect}>
            {t<string>("header-a-btn-2")}
          </div>
        )}
        <Notice />
      </div>
    </div>
  );
};

Header.propTypes = {
  setLoginUser: PropTypes.func.isRequired,
};
