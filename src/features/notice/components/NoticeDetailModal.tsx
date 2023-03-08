import "./styles/noticeDetailModal.less";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { locale } from "@/config";
dayjs.extend(utc);

// const notificationType = {
//   1: "Application",
//   2: "Approved",
//   3: "Approval Denied",
//   4: "Approved Automatically",
//   5: "Create Policy",
// };

const NoticeDetailModal = (props: any) => {
  const { viewItem } = props;
  if (!viewItem) {
    return <></>;
  }

  const {
    apply_end_at,
    apply_start_at,
    apply_status,
    created_at,
    file_name,
    file_owner_id,
    kind,
    owner_id,
    proposer_id,
    remark,
  } = viewItem;

  return (
    <>
      <div className="notice-detail">
        <div className="notice-info-card notice-info-l">
          <div>
            <h3>File Name</h3>
            <p>{file_name}</p>
          </div>
          <div>
            <h3>Apply Status</h3>
            <p>{locale.messages.fileApplyStatus[apply_status]}</p>
          </div>
          <div>
            <h3>Apply Start Time</h3>
            <p>
              {dayjs(apply_start_at * 1000)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss") + " (UTC)"}
            </p>
          </div>
          <div>
            <h3>Apply End Time</h3>
            <p>
              {dayjs(apply_end_at * 1000)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss") + " (UTC)"}
            </p>
          </div>
        </div>
        <i className="line" />
        <div className="notice-info-card notice-info-r">
          <div>
            <h3>Notification Type</h3>
            <Tooltip title={locale.messages.notificationType[kind]}>
              <p>{locale.messages.notificationType[kind]}</p>
            </Tooltip>
          </div>
          <div>
            <h3>File Owner ID</h3>
            <Tooltip title={file_owner_id || "NULL"}>
              <p>{file_owner_id || "NULL"}</p>
            </Tooltip>
          </div>
          <div>
            <h3>Owner ID</h3>
            <Tooltip title={owner_id || "NULL"}>
              <p>{owner_id || "NULL"}</p>
            </Tooltip>
          </div>
          <div>
            <h3>Proposer ID</h3>
            <Tooltip title={proposer_id || "NULL"}>
              <p>{proposer_id}</p>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeDetailModal;
