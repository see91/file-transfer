import { Upload, Button } from "antd";
import { UploadList } from "./uploadList";
import "../assets/index.less";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OvalButton from "@/components/Button/OvalButton";
const { Dragger } = Upload;
export const UploadFile = () => {
  const { t } = useTranslation();
  const [uploadList, setUploadList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [list, setList] = useState([]);
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        setUploadList(info.fileList);
        // setUploadList(list.concat(info.fileList));
        setShowList(true);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleChange = (val, list) => {
    setList(list);
    setShowList(val);
  };

  const _upload = () => {
    if (typeof (window.chrome as any).app.isInstalled !== "undefined") {
      const nulink = globalThis.nulink;
      nulink.sendMessage({ type: "uploadFilesCreatePolicyByWeb" });
    }
  };

  return (
    <div className="upload_page">
      {/* <div className='upload_page'>
      <Button onClick={_upload}>{t<string>("upload-file-a-drag-btn")}</Button>
    </div> */}
      <div className="upload_page_top">
        <p className="title">{t<string>("upload-list-a-title")}</p>
        <OvalButton
          title="Add File"
          onClick={() => {
            (document.querySelector(".drag_title") as any).click();
          }}
        />
      </div>
      {/* {!showList ? (
        <div className="upload_page_item">
          <Dragger {...props}>
            <div className="drag_title">
              <svg
                width="48"
                height="32"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 16.0001H6.00001C2.87438 16.002 0.2709 13.604 0.0163703 10.4887C-0.23816 7.37347 1.94153 4.58465 5.02601 4.07911C6.44572 1.562 9.11012 0.00362534 12 5.65992e-05C13.802 -0.00675485 15.5525 0.601415 16.962 1.72411C18.3461 2.82197 19.3301 4.34509 19.762 6.05811C22.3459 6.45514 24.1878 8.77563 23.988 11.3822C23.7882 13.9888 21.6142 16.0015 19 16.0001ZM12 2.0001C9.83172 2.00267 7.83268 3.17221 6.76801 5.06111L6.30001 5.90011L5.35101 6.05511C3.30129 6.39852 1.85602 8.25441 2.02522 10.3258C2.19442 12.3972 3.92173 13.9939 6.00001 14.0001H19C20.5686 14.0017 21.8736 12.7947 21.9942 11.2308C22.1148 9.66685 21.0103 8.27401 19.46 8.03511L18.144 7.83511L17.822 6.54311C17.1573 3.86992 14.7546 1.99507 12 2.0001ZM13.45 12.0001H10.55V9.00011H8.00001L12 5.00011L16 9.00011H13.45V12.0001Z"
                  fill="#98989A"
                />
              </svg>
              <span>
                Drag and drap the file in to the area to upload.{" "}
                <i className="tag">Up to 5 files can be uploaded</i>
              </span>
            </div>
            <div className="drag_tip">
              <p>
                All file formats supported（For instance: jpg, png, gif, mp4,
                doc, xls, pdf etc.）{" "}
              </p>
              <i className="tag">The size of files cannot exceed 5M</i>
            </div>
          </Dragger>
        </div>
      ) : (
        <UploadList list={uploadList} handleChange={handleChange} />
      )} */}
      {/* <div className="upload_page_item"> */}
      <div className={`upload_page_item ${showList ? "visib" : ""}`}>
        <Dragger {...props}>
          <div className="drag_title">
            <svg
              width="48"
              height="32"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 16.0001H6.00001C2.87438 16.002 0.2709 13.604 0.0163703 10.4887C-0.23816 7.37347 1.94153 4.58465 5.02601 4.07911C6.44572 1.562 9.11012 0.00362534 12 5.65992e-05C13.802 -0.00675485 15.5525 0.601415 16.962 1.72411C18.3461 2.82197 19.3301 4.34509 19.762 6.05811C22.3459 6.45514 24.1878 8.77563 23.988 11.3822C23.7882 13.9888 21.6142 16.0015 19 16.0001ZM12 2.0001C9.83172 2.00267 7.83268 3.17221 6.76801 5.06111L6.30001 5.90011L5.35101 6.05511C3.30129 6.39852 1.85602 8.25441 2.02522 10.3258C2.19442 12.3972 3.92173 13.9939 6.00001 14.0001H19C20.5686 14.0017 21.8736 12.7947 21.9942 11.2308C22.1148 9.66685 21.0103 8.27401 19.46 8.03511L18.144 7.83511L17.822 6.54311C17.1573 3.86992 14.7546 1.99507 12 2.0001ZM13.45 12.0001H10.55V9.00011H8.00001L12 5.00011L16 9.00011H13.45V12.0001Z"
                fill="#98989A"
              />
            </svg>
            <span>
              Drag and drap the file in to the area to upload.{" "}
              <i className="tag">Up to 5 files can be uploaded</i>
            </span>
          </div>
          <div className="drag_tip">
            <p>
              All file formats supported（For instance: jpg, png, gif, mp4, doc,
              xls, pdf etc.）{" "}
            </p>
            <i className="tag">The size of files cannot exceed 5M</i>
          </div>
        </Dragger>
      </div>
      <UploadList list={uploadList} handleChange={handleChange} />
      {/* {
        !showList && (<div className='upload_page'>
          <Dragger {...props}>
            <div className="drag_title">{t<string>("upload-file-a-drag-1")}</div>
            <div className="drag_tip">{t<string>("upload-file-a-drag-2")}</div>
            <div className="drag_btn">{t<string>("upload-file-a-drag-btn")}</div>
          </Dragger>
        </div>)
      }
      {
        showList && (<UploadList list={uploadList} handleChange={handleChange} />)
      } */}
    </div>
  );
};
