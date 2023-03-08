import "../assets/style/notice.less";
import NoticeList from "./NoticeList";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { getNoticeList, setBatchRead } from "../api/notice";
import { sendMessageSync } from "@/lib/sendMessage";
import useInterval from "@/hooks/useInterval";
import OvalButton from "@/components/Button/OvalButton";
import Alert from "@/components/Layout/Alert";
import { AlertColor } from "@mui/material";

export const Notice = () => {
  const [page, setPage] = useState<number>(1);
  const [userInfo, setUserInfo] = useState<any>({});
  const [noticeData, setNoticeData] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const _getUserInfo = async () => {
    const data = await sendMessageSync("getUserDetails", {});
    const { account_id, encrypted_pk } = data;
    setUserInfo(data);
    _fetch(page, account_id, encrypted_pk);
  };

  useInterval(async (id: number) => {
    const { account_id, encrypted_pk } = userInfo;
    if (account_id && encrypted_pk) {
      await _fetch();
    }
  }, 1000 * 5);

  const _fetch = async (sPage?, accountId?, encryptedPk?) => {
    const { account_id, encrypted_pk } = userInfo;
    const { code, data } = await getNoticeList({
      account_id: accountId || account_id,
      signature: encryptedPk || encrypted_pk,
      paginate: {
        page: sPage || page,
        page_size: 10,
      },
    });
    if (code === 2000) {
      setNoticeData(data);
    }
  };

  const _setBatchRead = async () => {
    const { account_id } = userInfo;
    const notice_ids: any = [];
    noticeData?.list.forEach((x) => {
      notice_ids.push(x.notice_id);
    });
    try {
      await setBatchRead({
        account_id,
        notice_ids,
        signature: " ",
      });
      _getUserInfo();
      setOpen(true);
      setAlertMessage("Successfully Set");
    } catch (error) {
      setOpen(true);
      setSeverity("error");
      setAlertMessage("error");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    _getUserInfo();
  }, []);

  return (
    <>
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
      <div className="contriner">
        <div className="main-layout notice">
          <div className="main-content">
            <h2 className="notice-list">Notice List</h2>
            <div className="c_func">
              <OvalButton
                title="Set the current page as read"
                disabled={noticeData?.total <= 0}
                onClick={_setBatchRead}
              />
            </div>
            <NoticeList list={noticeData?.list ?? []} />
            <div className="pagination">
              <Pagination
                count={
                  noticeData?.total ? Math.ceil(noticeData?.total / 10) : 1
                }
                onChange={(e, page) => {
                  setPage(page);
                  _fetch(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
