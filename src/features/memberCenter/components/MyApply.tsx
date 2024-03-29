import { Select, Table, Tooltip, Modal } from "antd";
import { Pagination } from "@mui/material";
import { t } from "i18next";
import "../assets/myApply.less";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState, useEffect } from "react";
import { formatDate, betweenDays, toDisplayAddress } from "@/utils/format";
import {
  getApprovedFileContentByFileId,
  type ApprovedFileContentByFileIdRequestOptions,
  getFilesByStatusForAllApplyAsUser,
  type FilesByStatusForAllApplyAsUserRequestOptions,
} from "../api/apply";
import { locale } from "@/config";
import OvalButton from "@/components/Button/OvalButton";
import {decryptionRequestData} from "@/unlinkagent/types";
import {encodeRequestData} from "@/unlinkagent/api";
import storage from "@/utils/storage";
import {cache_user_key} from "@/features/auth/api/getLoginedUserInfo";
import {decrypt} from "@/utils/crypto";
import {getData} from "@/utils/ipfs";
import {download as fileDownload} from "@/unlinkagent/api";
dayjs.extend(utc);

const { Option } = Select;
const selectStyle = {
  width: "130px",
};
export const MyApply = () => {
  // const fileApplyStatusDefault = 1;
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [applyList, setApplyList] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(0);
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const seeNote = async (record) => {
    setIsNoteModalVisible(true);
    setCurrentRecord(record);
  };
  useEffect(() => {
    (async () => {
      await statusSelectHandler(0);
    })();
  }, []);
  const columns = [
    {
      title: `${t<string>("member-center-apply-table-title-2")}`,
      dataIndex: "file_name",
      width: 200,
      key: "file_name",
    },
    // {
    //   title: `${t<string>("member-center-apply-table-title-1")}`,
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   render: (_, record) => formatDate(record.created_at * 1000),
    // },
    // {
    //   title: `${t<string>("member-center-apply-table-title-expiration-time")}`,
    //   dataIndex: "end_at",
    //   key: "end_at",
    //   render: (_, record) =>
    //     record.status > 1 ? formatDate(record.end_at * 1000) : "~",
    // },
    {
      title: `${t<string>("member-center-apply-table-title-3")}`,
      dataIndex: "days",
      key: "days",
      align: "center" as "center",
      render: (_, record) => (status <= 1 ? record.days : "~"),
    },
    {
      title: `${t<string>("member-center-apply-table-title-5")}`,
      dataIndex: "policy_id",
      key: "policy_id",
      render: (_, record) => record.policy_id || "~",
    },
    // {
    //   title: `${t<string>("member-center-apply-table-title-8")}`,
    //   dataIndex: "file_id",
    //   key: "file_id",
    // },
    // {
    //   title: `${t<string>("member-center-apply-table-title-3")}`,
    //   dataIndex: "useDay",
    //   key: "useDay",
    //   align: "center" as "center",
    //   render: (_, record) => {
    //     return betweenDays(record.start_at, record.end_at);
    //   },
    // },
    {
      title: `${t<string>("member-center-apply-table-title-4")}`,
      dataIndex: "status",
      key: "status",
      render: (_, record) => locale.messages.fileApplyStatus[record.status],
    },
    {
      // title: `${t<string>("member-center-apply-table-title-6")}`,
      dataIndex: "oprate",
      key: "oprate",
      render: (txt, record, index) => {
        if (record.status === 2) {
          return (
            <div style={{ textAlign: "center" }}>
              <OvalButton
                onClick={() => seeNote(record)}
                title={t<string>("member-center-approve-table-btn-1")}
              />
              <OvalButton
                onClick={() => download(record)}
                title={t<string>("member-center-apply-btn") as string}
              />
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "#7D92FF",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 600,
              }}
              onClick={() => seeNote(record)}
            >
              {t<string>("member-center-approve-table-btn-1")}
            </div>
          );
        }
      },
    },
    // {
    //   title: `${t<string>("member-center-apply-table-title-7")}`,
    //   dataIndex: 'hrac',
    //   key: 'hrac',
    // }
  ];

  const download = async (record) => {
    record.proposer_address = currentRecord.proposer_address
    await fileDownload(record)
  };

  const authorizationSuccessHandler = async (e) => {
    const responseData = JSON.parse(e.data)
    const redirectUrl = responseData.redirectUrl
    if (responseData && redirectUrl ) {
      if (responseData.subAction && responseData.subAction == 'relogin') {
        const userInfo = {
          accountAddress: responseData.accountAddress,
          accountId: responseData.accountId,
          publicKey: responseData.publicKey
        }
        storage.setItem(cache_user_key, JSON.stringify(userInfo));
      }
      if (responseData.action == 'decrypted' && responseData.result == 'success') {
        if (!!responseData && responseData.url){
          const uuid = localStorage.getItem("uuid")
          const decryptUrl = decrypt(responseData.url, uuid).replaceAll('"','')
          const arraybuffer = await getData(decryptUrl)
          const blob = new Blob([arraybuffer], {type: "arraybuffer"});
          let url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download",responseData.fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        window.removeEventListener("message", authorizationSuccessHandler)
      }
    }
  }

  const statusSelectHandler = async (value) => {
    const user = storage.getItem("userinfo");
    setStatus(value);
    setPageIndex(1);
    const params: any = {
      proposer_id: user?.accountId,
      // signature: "1P3HfMIdhkA_CVuO09zDC",
      status: 0,
      paginate: {
        page: 1,
        page_size: 10,
      },
    };
    const result = (await getFilesByStatusForAllApplyAsUser(params)).data;
    setApplyList(result?.list || []);
    setTotal(result?.total || 0);
  };
  const pageChange = async (e, val) => {
    setPageIndex(val);
    // const params: FilesByStatusForAllApplyAsUserRequestOptions = {
    //   status,
    //   pageSize,
    //   pageIndex: val,
    // };
    const user = storage.getItem("userinfo");
    const params: any = {
      proposer_id: user?.accountId,
      // signature: "1P3HfMIdhkA_CVuO09zDC",
      status: 0,
      paginate: {
        page: val,
        page_size: 10,
      },
    };

    const result = (await getFilesByStatusForAllApplyAsUser(params)).data;
    setApplyList(result?.list || []);
    setTotal(result?.total || 0);
  };
  return (
    <div className="my_apply">
      <div className="my_apply_select">
        <Select style={selectStyle} onChange={statusSelectHandler}>
          {locale.fields.fileApplyStatus.map((item) => {
            // exclude value 0
            if (item.value === 0) return false;
            return (
              <Option key={item.label} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      </div>
      <div className="my_apply_table">
        <Table
          columns={columns}
          dataSource={applyList}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      </div>
      <div className="pagination">
        <Pagination
          count={total ? Math.ceil(total / pageSize) : 1}
          onChange={pageChange}
        />
      </div>
      <Modal
        title={t<string>("member-center-approve-table-btn-1")}
        width="640px"
        visible={isNoteModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="modal_class"
        onCancel={() => {
          setCurrentRecord({});
          setIsNoteModalVisible(false);
        }}
      >
        <div className="file-info">
          <div>
            <span>File name:</span>
            <span>{currentRecord?.file_name}</span>
          </div>
          <div>
            <span>Policy id:</span>
            <span>{currentRecord?.policy_id || "~"}</span>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-3")}:`}</span>
            <Tooltip title={currentRecord?.file_owner_address}>
              <span>{toDisplayAddress(currentRecord?.file_owner_address)}</span>
            </Tooltip>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-4")}:`}</span>
            <Tooltip title={currentRecord?.proposer_address}>
              <span>{toDisplayAddress(currentRecord?.proposer_address)}</span>
            </Tooltip>
          </div>
          {currentRecord?.status === 2 ? (
            <>
              <div>
                <span>Request time:</span>
                <span>
                  {dayjs(Number(currentRecord?.created_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
              <div>
                <span>Expiration time:</span>
                <span>
                  {dayjs(Number(currentRecord?.end_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
            </>
          ) : (
            <div>
              <span>Request Period:</span>
              <span>{currentRecord?.days || "~"}</span>
            </div>
          )}
          <div>
            <span>Status:</span>
            <span>
              {locale.messages.fileApplyStatus[currentRecord?.status]}
            </span>
          </div>
          <div>
            <span>Note:</span>
            <span>{currentRecord?.remark || "NULL"}</span>
          </div>
        </div>
        <div className="modal_btn">
          <OvalButton
            title={t<string>("member-center-approve-modal-btn-3")}
            onClick={() => setIsNoteModalVisible(false)}
          />
        </div>
      </Modal>
    </div>
  );
};
