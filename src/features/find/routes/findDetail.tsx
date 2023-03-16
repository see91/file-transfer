import { Row, Col, Table, Modal, Input, Form, Button, Select } from "antd";
import {
  UploadOutlined,
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import "../assets/index.less";
import {
  defaultImageHandler,
  defaultImage,
  defaultAvatarImage,
} from "@/utils/defaultImage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { formatDate, betweenDays } from "@/utils/format";
import { getFileDetail, type FileDetailRequestOptions } from "../api/find";
import OvalButton from "@/components/Button/OvalButton";
import {
  applyPermissionForFiles,
  type ApplyPermissionForFilesRequestOptions,
  getFilesForApprovedAsUser,
  type FilesForApprovedAsUserRequestOptions,
  getApprovedFileContentByFileId,
  type FilesForUploaderRequestOptions,
  getContentAsUploaderByFileId,
  type ApprovedFileContentByFileIdRequestOptions,
} from "../api/apply";
import { UsePopup } from "@/components/Popup";

import type { FileApplyOptions } from "../types";
import {
  cache_user_key,
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import { resolveModuleNameFromCache } from "typescript";
import {applyRequestData, decryptionRequestData} from "@/unlinkagent/types";
import {encodeRequestData} from "@/unlinkagent/api";
import storage from "@/utils/storage";
import {getData} from "@/utils/ipfs";
const { Option } = Select;

const btnStyle = {
  width: "150px",
  height: "48px",
  background: "#7A7A7A",
  borderRadius: "100px",
  padding: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
};
const btnStyleOk = {
  background: "#503A86",
  marginLeft: "20px",
};

export const FindDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [applyStatus, setApplyStatus] = useState<number | null>(null);
  const location = useLocation();
  const [detailItem, setDetailItem] = useState<Record<string, any>>({});
  const [approvedFileList, setApprovedFileList] = useState([]);
  const [buttonShow, setButtonShow] = useState(true);
  const [visible, setVisible] = useState(false); // result tips popup window
  const [bUploader, setIsUploader] = useState(false); // user.id === detailItem.creator_id id the uploader
  const [user, setUser] = useState(null);

  /**
   * apply for file
   * @param values {usageDays: number}
   */
  const applyForFile = async (values) => {
    const userInfo = storage.getItem("userinfo");
    const agentAccountAddress = userInfo.accountAddress;
    const agentAccountId = userInfo.accountId;
    if (agentAccountAddress && agentAccountId) {
      const applyParam: applyRequestData = {
        accountAddress: agentAccountAddress,
        accountId: agentAccountId,
        redirectUrl: document.location.toString(),
        sourceUrl: document.domain,
        fileName: detailItem.file_name,
        fileId: detailItem.file_id,
        owner: detailItem.creator_address,
        user: userInfo.accountAddress,
        days: values.usageDays,
      };

      const uuid = await localStorage.getItem("uuid");
      const publicKey = userInfo.publicKey;
      if (uuid && publicKey) {
        const paramData = encodeRequestData(applyParam, uuid);
        const key = encodeRequestData(uuid, publicKey);
        window.open(
          "http://localhost:3000/request-files?from=outside&data=" +
            encodeURIComponent(paramData) +
            "&key=" +
            encodeURIComponent(key),
        );
        window.addEventListener("message", applySuccessHandler);
      }
    }
  };

  const applySuccessHandler = async (e) => {
    const responseData = JSON.parse(e.data);
    const redirectUrl = responseData.redirectUrl;
    if (
      responseData &&
      redirectUrl &&
      redirectUrl == document.location.toString()
    ) {
      if (responseData.subAction && responseData.subAction == "relogin") {
        const userInfo = {
          accountAddress: responseData.accountAddress,
          accountId: responseData.accountId,
          publicKey: responseData.publicKey,
        };
        storage.setItem(cache_user_key, JSON.stringify(userInfo));
      }
      if (responseData.action == "apply" && responseData.result == "success") {
        window.removeEventListener("message", applySuccessHandler);
        window.location.reload();
      }
    }
  };

  const _getFileDetail = async () => {
    const user = getUserCache();
    setUser(user);

    if (!user) {
      return;
    }

    // get state param by find.tsx page: navigate("/findDetail", { state: fileDetail });  // pass param between pages
    let passedFile: any = {};
    if (!location.state) {
      //
      navigate("/find", {});
    } else if ((location.state as any).file) {
      passedFile = (location.state as any).file;
      setButtonShow((location.state as any).hide);
    } else {
      passedFile = location.state as any;
    }

    (async (user) => {
      const params: any = {
        file_id: passedFile.file_id,
        consumer_id: user.accountId,
      };
      const result = (await getFileDetail(params)).data;

      if (!!result.creator_avatar) {
        const avatarStr = await getAvatarBase64String(result.creator_avatar);
        if (!!avatarStr) {
          result.creator_avatar = avatarStr;
        } else {
          result.creator_avatar = defaultAvatarImage;
        }
      } else {
        result.creator_avatar = defaultAvatarImage;
      }

      setDetailItem(
        Object.assign({}, result, {
          owner: result.creator || passedFile.owner,
          src: passedFile.src,
        }),
      );

      const isUploader = result.creator_id === user.id;
      setIsUploader(isUploader);

      /**
       * Is not to apply for, if result.status === 0
       * Application status: 0: unapplied, 1: Applied, 2: approved, 3: rejected
       */
      setApplyStatus(result.status);

      if (result.status === 0 && !isUploader) {
        setButtonShow(true);
      }

      // get approved file list as account used
      const approveParams: FilesForApprovedAsUserRequestOptions = {};
      const approved = await getFilesForApprovedAsUser(approveParams);
      console.log("approved", approved);
      setApprovedFileList(approved.list);
    })(user);
  };

  useEffect(() => {
    _getFileDetail();
  }, [location]);

  // const columns = [
  //   {
  //     title: `${t<string>("find-detail-a-table-column-1")}`,
  //     dataIndex: "created_at",
  //     key: "created_at",
  //     render: (_, record) => (
  //       <span>{formatDate(record.created_at * 1000)}</span>
  //     ),
  //   },
  //   {
  //     title: `${t<string>("find-detail-a-table-column-2")}`,
  //     dataIndex: "proposer_id",
  //     key: "proposer_id",
  //   },
  //   {
  //     title: `${t<string>("find-detail-a-table-column-3")}`,
  //     dataIndex: "useDay",
  //     key: "useDay",
  //     align: "center" as "center",
  //     render: (_, record) => (
  //       <span>{betweenDays(record.apply_start_at, record.apply_end_at)}</span>
  //     ),
  //   },
  // ];

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const applyDownload = () => {
    setIsModalVisible(true);
  };
  const fileDownload = async () => {
    const userInfo = storage.getItem("userinfo");
    const agentAccountAddress = userInfo.accountAddress
    const agentAccountId = userInfo.accountId

    if (agentAccountAddress && agentAccountId){
      const decryptionRequestData: decryptionRequestData = {
        accountAddress: agentAccountAddress,
        accountId: agentAccountId,
        redirectUrl: document.location.toString(),
        sourceUrl: document.domain,
        fileId: detailItem.file_id,
        fileName: detailItem.file_name,
        from: agentAccountAddress,
        to: detailItem.proposer_address
      }
      const uuid = await localStorage.getItem("uuid")
      const publicKey = userInfo.publicKey
      if (uuid && publicKey){
        const paramData = encodeRequestData(decryptionRequestData, uuid)
        const key = encodeRequestData(uuid, publicKey)
        window.open("http://localhost:3000/request-authorization?from=outside&data=" + encodeURIComponent(paramData) + "&key=" + encodeURIComponent(key))
      }
      window.addEventListener("message", authorizationSuccessHandler)
    }
  };

  const authorizationSuccessHandler = async (e) => {
    const responseData = e.data
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
          const arraybuffer = await getData(responseData.url)
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
  const IconCom = () => {
    switch (applyStatus) {
      case 0:
        // not applied yet
        return null;
      case 1:
        // pending review
        return (
          <div className="find_detail_apply_status">
            <ClockCircleFilled
              name="dateTime"
              style={{ color: "#68BB8D", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-1")}
          </div>
        );
      case 2:
        // application passed
        return (
          <div className="find_detail_apply_status">
            <CheckCircleFilled
              style={{ color: "#68BB8D", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-2")}
          </div>
        );
      case 3:
        // application rejected
        return (
          <div className="find_detail_apply_status_error">
            <CloseCircleFilled
              style={{ color: "#FF3838", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-3")}
          </div>
        );
      case 4:
        // application expired, out of date
        return (
          <div className="find_detail_apply_status_disabled">
            <ExclamationCircleFilled
              style={{ color: "#939CB0", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-4")}
          </div>
        );
    }
  };
  const ButtonCom = () => {
    switch (applyStatus) {
      case 0:
      case 1:
        /**
         * not applied yet
         *  or
         * pending review
         */
        return null;
      case 2:
        // application passed
        return (
          <OvalButton
            title={t<string>("find-detail-a-btn-1")}
            onClick={() => fileDownload()}
          />
        );
      case 3:
      case 4:
        /**
         * application rejected
         *  or
         * application expired, out of date
         */
        return (
          <OvalButton
            title={t<string>("find-detail-a-btn-2")}
            onClick={() => applyDownload()}
          />
        );
    }
  };

  const fileImgAreaStyle = {
    width: "75px",
    height: "fit-content",
    display: "inline-block",
  };

  return (
    <div className="find_detail marb-30">
      <Row className="find_detail_top">
        <Col span="12">
          <div className="find_detail_top_left">
            {!detailItem.thumbnail ? (
              <div className="file_img_area">
                <img
                  style={fileImgAreaStyle}
                  src={detailItem.src || defaultImage}
                  alt=""
                />
              </div>
            ) : (
              <img src={detailItem.src} alt="" onError={defaultImageHandler} />
            )}
          </div>
        </Col>
        <Col span="12">
          <div className="find_detail_top_right">
            <div className="find_detail_top_right_title flex_row">
              <div>{detailItem.file_name}</div>
              {/* <div>
                <UploadOutlined
                  style={{
                    fontSize: "16px",
                    color: "#503A86",
                    marginRight: "8px",
                  }}
                />
                0
              </div> */}
            </div>
            <div className="find_detail_top_right_content">
              <div
                className="flex_row top_right_content_item mtb_30 pointer"
                onClick={() => {
                  navigate(`/creator/${detailItem.creator_id}`);
                }}
              >
                <img
                  src={detailItem.creator_avatar || defaultAvatarImage}
                  alt=""
                />
                <div>
                  <div>{t<string>("find-detail-a-info-label-1")}</div>
                  {/* <div>{t<string>("find-detail-account-address")}</div> */}
                  <div>{detailItem.owner}</div>
                </div>
              </div>
              <div className="flex_row top_right_content_item">
                <div className="left_color">
                  {t<string>("find-detail-ipfs-file-address")}：
                </div>
                <div className="right_color">
                  {detailItem.file_ipfs_address}
                </div>
              </div>
              <div className="flex_row top_right_content_item">
                <div className="left_color">
                  {t<string>("find-detail-a-info-label-2")}：
                </div>
                <div className="right_color">
                  {formatDate(detailItem.file_created_at * 1000)}
                </div>
              </div>
              {/* <div className="flex_row top_right_content_item">
                <div className="left_color">Token ID：</div>
                <div className="right_color">9518</div>
              </div>
              <div className="flex_row top_right_content_item">
                <div className="left_color">Blockchain：</div>
                <div className="right_color">Abey Chain</div>
              </div> */}
            </div>
            {(applyStatus === null || !buttonShow) && (
              <div className="mart-30"></div>
            )}

            {bUploader && (
              <div className="find_detail_apply_box">
                <div
                  className="find_detail_apply_btn"
                  onClick={() => fileDownload()}
                >
                  {t<string>("find-detail-a-btn-1")}
                </div>
              </div>
            )}
            {!bUploader && applyStatus === 0 && buttonShow && (
              <div
                className="find_detail_top_right_btn"
                onClick={applyDownload}
              >
                {t<string>("find-detail-a-btn")}
              </div>
            )}
            {!bUploader && [1, 2, 3, 4].includes(applyStatus as number) && (
              <div className="find_detail_apply_box">
                <div className="find_detail_apply_info">
                  <div className="find_detail_apply_info_left">
                    <div>
                      {t<string>("find-detail-a-info-label-4")}:{" "}
                      {formatDate(detailItem.apply_created_at * 1000)}
                    </div>
                    <div>
                      {t<string>("find-detail-a-info-label-5")}:{" "}
                      {detailItem?.apply_days || "~"}
                    </div>
                    {applyStatus === 2 && (
                      <>
                        <div>
                          {t<string>("find-detail-owning-strategy")}:{" "}
                          {detailItem.policy_id}
                        </div>
                        <div>
                          {t<string>("find-detail-strategy-owner")}:{" "}
                          {detailItem.creator_address}
                        </div>
                      </>
                    )}
                  </div>
                  {IconCom()}
                </div>
                {ButtonCom()}
              </div>
            )}
          </div>
        </Col>
      </Row>
      {/* <div className="find_detail_bottom">
        <div className="find_detail_bottom_title">{t<string>("find-detail-a-table-title")}</div>
        <Table columns={columns} dataSource={approvedFileList} pagination={false} />
      </div> */}
      <Modal
        title={t<string>("find-detail-a-btn")}
        width="640px"
        destroyOnClose
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        footer={null}
        maskClosable={false}
        className="modal_class"
      >
        <Form
          preserve={false}
          form={form}
          initialValues={{
            usageDays: 1,
          }}
          onFinish={async (values: FileApplyOptions) => {
            if (detailItem.status == 4){
              await fileDownload()
            } else {
              await applyForFile(values);
            }
            // onSuccess();
          }}
        >
          <div className="flex_row mar_0">
            <Form.Item
              label={t<string>("find-detail-a-modal-lable")}
              // colon={false}
              name="usageDays"
            >
              <Select
                defaultValue="1"
                style={{ width: 120 }}
                options={[
                  {
                    value: "1",
                    label: "1",
                  },
                  {
                    value: "2",
                    label: "2",
                  },
                  {
                    value: "3",
                    label: "3",
                  },
                  {
                    value: "4",
                    label: "4",
                  },
                  {
                    value: "5",
                    label: "5",
                  },
                  {
                    value: "6",
                    label: "6",
                  },
                  {
                    value: "7",
                    label: "7",
                  },
                ]}
              />
              {/* <Input /> */}
              {/* <span className="ml_20">{t<string>("find-detail-a-modal-day")}</span> */}
            </Form.Item>
            <div className="ml_20">{t<string>("find-detail-a-modal-day")}</div>
          </div>

          <div className="modal_btn">
            <Button style={btnStyle} onClick={handleCancel}>
              {t<string>("find-detail-a-modal-btn-no")}
            </Button>
            <Button
              style={Object.assign({}, btnStyle, btnStyleOk)}
              htmlType="submit"
            >
              {t<string>("find-detail-a-modal-btn-ok")}
            </Button>
          </div>
        </Form>
      </Modal>
      <UsePopup
        visible={visible}
        onChange={setVisible}
        content="Operate success!"
      />
    </div>
  );
};
