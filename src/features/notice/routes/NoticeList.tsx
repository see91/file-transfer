import { Form, Input, Modal, Radio, Select, Tooltip, InputNumber } from "antd";
import "../assets/style/noticeList.less";
import dayjs from "dayjs";
import { t } from "i18next";
import utc from "dayjs/plugin/utc";
import OvalButton from "@/components/Button/OvalButton";
import { setNoticeRead, getApplyDetail } from "../api/notice";
import { sendMessageSync } from "@/lib/sendMessage";
import { useEffect, useState } from "react";
import { locale } from "@/config";
import copy from "copy-to-clipboard";
import copyLogo from "../assets/copy.svg";
import { toDisplayAddress } from "@/utils/format";
// import FuncModal from "@/components/Layout/FuncModal";
// import NoticeDetailModal from "../components/NoticeDetailModal";
import Alert from "@/components/Layout/Alert";
import { AlertColor } from "@mui/material";
import {
  useWalletPay,
  type UseWalletPayRequestOptions,
} from "@/features/auth/api/useWalletPay";
import {
  refuseApplicationOfUseFiles,
  type RefuseApplicationOfUseFilesRequestOptions,
} from "@/features/memberCenter/api/account";
import {
  ApplyStatusOfBeingApprovedOrApprovedRequestOptions,
  IsApplyStatusOfBeingApprovedOrApproved,
} from "@/features/auth/api/applyStatusOfBeingApprovedOrApproved";

dayjs.extend(utc);
const { TextArea } = Input;
interface listItem {
  kind: number;
  is_read: boolean;
  notice_id: number;
  file_name: string;
  is_success: boolean;
  apply_start_at: number;
  created_at: number;
}

type ModalFormOptions = {
  selector: 1 | 2;
  remark: string;
};

const selectStyle = {
  width: "130px",
};

const { Option } = Select;

const NoticeList = (data: any) => {
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [viewItemData, setViewItemData] = useState<any>(null);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [isAuditModalVisible, setIsAuditModalVisible] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<number>(0);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [ursulaShares, setUrsulaShares] = useState(1);
  const [ursulaThreshold, setUrsulaThreshold] = useState(1);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [useWalletParams, setUseWalletParams] =
    useState<UseWalletPayRequestOptions>();

  const _getUserInfo = async () => {
    const data = await sendMessageSync("getUserDetails", {});
    setUserInfo(data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const _getApplyDetail = async (params) => {
    const { code, data } = await getApplyDetail(params);
    if (code === 2000) {
      const { status } = data;
      setApplyStatus(status);
    } else {
      setApplyStatus(0);
    }
  };

  const _copy = (val: string) => {
    try {
      copy(val);
      setOpen(true);
      setAlertMessage("Copy Success!");
    } catch (error) {
      // nothing
    }
  };

  const _setNoticeRead = async (x) => {
    const { is_read, notice_id, kind, apply_id, proposer_id, apply_days } = x;

    setViewItemData(x);

    if (Number(kind) === 1) {
      await _getApplyDetail({ apply_id });
    } else {
      setApplyStatus(0);
    }

    // if (Number(kind) === 1) {
    setUseWalletParams({
      startSeconds: Number(dayjs().unix()),
      endSeconds: Number(dayjs().add(apply_days, "days").unix()),
      userAccountId: proposer_id,
      applyId: apply_id,
      remark: "",
      ursulaShares: ursulaShares,
      ursulaThreshold: ursulaThreshold < 1 ? 1 : Math.floor(ursulaThreshold),
    });
    setIsAuditModalVisible(true);
    // } else {
    //   setOpenDetailModal(true);
    // }
    /**
     * Set is read
     */
    if (!is_read) {
      const { account_id, encrypted_pk } = userInfo;
      const { code } = await setNoticeRead({
        notice_id,
        account_id,
        signature: encrypted_pk,
      });
      if (code === 2000) {
      }
    }
  };

  const approveSubmit = async ({ selector, remark }: ModalFormOptions) => {
    if (selector === 1) {
      const { applyId } = useWalletParams as UseWalletPayRequestOptions;

      const applyStatusOfBeingApprovedOrApprovedRequestOptions: ApplyStatusOfBeingApprovedOrApprovedRequestOptions =
        Object.assign({}, { applyId: applyId });

      const bApplyStatusOfBeingApprovedOrApproved: boolean =
        await IsApplyStatusOfBeingApprovedOrApproved(
          applyStatusOfBeingApprovedOrApprovedRequestOptions,
        );
      if (!!bApplyStatusOfBeingApprovedOrApproved) {
        //The policy has been approved. You do not need to apply for it again
        //TODO: show alert error msg
        setOpen(true);
        setSeverity("error");
        setAlertMessage(t("policy-is-currently-active"));
        return;
      }

      const resolveParams: UseWalletPayRequestOptions = Object.assign(
        {},
        useWalletParams,
        { remark },
      );
      console.log("useWalletParams", resolveParams);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const result = await useWalletPay(resolveParams);

      if (result) {
        setIsAuditModalVisible(false);
      }
    } else if (selector === 2) {
      // reject
      const { applyId } = useWalletParams as UseWalletPayRequestOptions;
      const rejectParams: RefuseApplicationOfUseFilesRequestOptions = {
        applyId,
        remark,
      };
      await refuseApplicationOfUseFiles(rejectParams);
      setIsAuditModalVisible(false);
    }
  };

  const sharesSelectHandler = async (value) => {
    setUrsulaShares(value);
  };

  const ursulaThresholdChange = async (value) => {
    setUrsulaThreshold(value);
  };

  useEffect(() => {
    _getUserInfo();
  }, []);

  return (
    <>
      <ul className="notice-list-ar">
        {data?.list.length > 0 ? (
          data.list.map((x: listItem) => {
            return (
              <li
                key={`${x.created_at}_${Math.random()}`}
                className={`${!x.is_read ? "is-read" : ""}`}
              >
                <div className="list-item-l">
                  <div className="event-name">
                    {x.file_name} {locale.messages.notificationType[x.kind]}
                  </div>
                  <div className="date">
                    {dayjs(x.created_at * 1000)
                      .utc()
                      .format("YYYY-MM-DD HH:mm:ss") + " (UTC)"}
                  </div>
                </div>
                <OvalButton
                  title="View Details"
                  onClick={_setNoticeRead.bind(this, x)}
                />
              </li>
            );
          })
        ) : (
          <li className="center">NO DATA</li>
        )}
      </ul>
      {/* {openDetailModal && (
        <FuncModal
          title="Message Detail"
          hideFotter
          onClose={() => {
            setOpenDetailModal(false);
          }}
        >
          <NoticeDetailModal viewItem={viewItemData} />
        </FuncModal>
      )} */}
      <Modal
        title={"Details"}
        width="640px"
        destroyOnClose
        visible={isAuditModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="approve_modal"
        onCancel={() => {
          setIsAuditModalVisible(false);
        }}
      >
        <div className="file-info">
          <div>
            <span>File name:</span>
            <span>{viewItemData?.file_name}</span>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-3")}:`}</span>
            <Tooltip title={viewItemData?.file_owner_address}>
              <span>{toDisplayAddress(viewItemData?.file_owner_address)}</span>
            </Tooltip>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-4")}:`}</span>
            <Tooltip title={viewItemData?.proposer_address}>
              <span>{toDisplayAddress(viewItemData?.proposer_address)}</span>
            </Tooltip>
          </div>
          {viewItemData?.apply_status === 2 ? (
            <>
              <div>
                <span>Request time:</span>
                <span>
                  {dayjs(Number(viewItemData?.apply_start_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
              <div>
                <span>Expiration time:</span>
                <span>
                  {dayjs(Number(viewItemData?.apply_end_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
            </>
          ) : (
            <div>
              <span>Request Period:</span>
              <span>{viewItemData?.apply_days || "~"}</span>
            </div>
          )}
          <div>
            <span>Status:</span>
            <span>
              {locale.messages.fileApplyStatus[viewItemData?.apply_status]}
            </span>
          </div>
          <div>
            <span>Note:</span>
            <span>{viewItemData?.remark || "~"}</span>
          </div>
          {viewItemData?.tx_hash && (
            <div className="hash">
              <span>Hash</span>
              <span>
                <a
                  href={`https://testnet.bscscan.com/tx/${viewItemData?.tx_hash}`}
                  className="hash-link"
                  target="_blank"
                >
                  {toDisplayAddress(viewItemData?.tx_hash)}
                </a>
                <img
                  src={copyLogo}
                  alt=""
                  onClick={_copy.bind(this, viewItemData?.tx_hash)}
                />
              </span>
            </div>
          )}
          {/* <div>
            <span>Request Time:</span>
            <span>
              {dayjs(Number(viewItemData?.apply_start_at) * 1000)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss")}
              (UTC)
            </span>
          </div>
          <div>
            <span>Expiration Time:</span>
            <span>
              {dayjs(Number(viewItemData?.apply_end_at) * 1000)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss")}
              (UTC)
            </span>
          </div>*/}
        </div>
        {applyStatus === 1 && (
          <>
            <div className="review-request-title">Review Request</div>
            <Form
              preserve={false}
              form={form}
              labelAlign="left"
              labelCol={{ span: 4, offset: 0 }}
              wrapperCol={{ span: 18 }}
              onFinish={async (values: ModalFormOptions) => {
                await approveSubmit(values);
              }}
            >
              <Form.Item
                className="label-half"
                label={t<string>("member-center-approve-modal-label-1")}
                name="selector"
                initialValue={1}
              >
                <Radio.Group>
                  {locale.fields.approveSelector.map((option) => (
                    <Radio value={option.value}>{option.label}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <Form.Item
                className="label-half"
                label={"Pre of shares"}
                name="shares"
              >
                <Select
                  style={selectStyle}
                  onChange={sharesSelectHandler}
                  defaultValue={ursulaShares}
                >
                  {locale.fields.preOfShares.map((item) => (
                    <Option key={item.label} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="label-half"
                label={"Pre of threshold"}
                name="ursulaThreshold"
                initialValue={
                  ursulaShares * 0.4 >= 1 ? Math.floor(ursulaShares * 0.4) : 1
                }
              >
                <InputNumber
                  min={1}
                  step={1}
                  style={selectStyle}
                  max={
                    Math.floor(ursulaShares * 0.5) < 1
                      ? 1
                      : Math.floor(ursulaShares * 0.5)
                  }
                  onChange={ursulaThresholdChange}
                />
              </Form.Item>

              <Form.Item
                label={t<string>("member-center-approve-modal-label-2")}
                name="remark"
              >
                <TextArea />
              </Form.Item>
              <div className="modal_btn">
                <OvalButton
                  title={t<string>("member-center-approve-modal-btn-1")}
                  onClick={() => {
                    setIsAuditModalVisible(false);
                  }}
                />
                <OvalButton
                  title={t<string>("member-center-approve-modal-btn-2")}
                  htmlType="submit"
                />
              </div>
            </Form>
          </>
        )}
      </Modal>
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
    </>
  );
};

export default NoticeList;
