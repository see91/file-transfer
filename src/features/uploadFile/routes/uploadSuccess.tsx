import "../assets/index.less";
import { CheckCircleFilled, ArrowRightOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
export const UploadSuccess = () => {
  const navigate = useNavigate()
  const goUpload = () => {
    navigate("/uploadFile")
  }
  return (
    <>
      <div className='upload_success'>
        <div className='upload_success_box'>
          <CheckCircleFilled style={{ fontSize: "50px", color: "#27B7AB" }} />
          <div className="success_tip">{t<string>("upload-success-a-title")}</div>
          <div>{t<string>("upload-success-a-text-1")}
            <span>{t<string>("upload-success-a-text-2")} <ArrowRightOutlined /> {t<string>("upload-success-a-text-3")}</span>
            {t<string>("upload-success-a-text-4")}
          </div>
          <div className="flex_row">
            <div className="upload_success_btn" onClick={goUpload}>{t<string>("upload-success-a-btn-1")}</div>
            <div className="upload_success_btn btn_right">{t<string>("upload-success-a-btn-2")}</div>
          </div>
        </div>
      </div>
    </>
  );
};