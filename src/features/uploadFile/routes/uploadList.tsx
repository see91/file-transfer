import "../assets/index.less";
import { CloseCircleFilled } from "@ant-design/icons";
import { defaultImage } from "@/utils/defaultImage";
import { Button, Form, Radio, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Buffer } from "buffer";
import { locale } from "@/config";
import { FileCategory } from "../types";
import { message as Message } from "antd";
import CloseButton from "@/components/Button/CloseButton";

const selectStyle = {
  width: "180px",
};
const btnStyle = {
  width: "200px",
  height: "60px",
  background: "#df9100",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontFamily: "PingFangSC-Medium, PingFang SC",
  fontWeight: "500",
};
type listType = {
  name: string;
  size: number;
  originFileObj: any;
}[];

type idListType = {
  label?: string;
}[];
export const UploadList = (props: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleChange, list } = props;
  const [uploadList, setUploadList] = useState<listType>([
    { name: "", size: 0, originFileObj: {} },
  ]);
  const [isAssociationStrategy, setIsAssociationStrategy] = useState<number>(2);
  const [fileType, setFileType] = useState([]);
  const typeList = (
    Object.keys(FileCategory).filter((v) =>
      isNaN(Number(v)),
    ) as (keyof typeof FileCategory)[]
  ).map((key) => FileCategory[key]);
  const [idList, setIdList] = useState<idListType>([]);

  useEffect(() => {
    setUploadList(list);
    // _getPublishedPolicyInfos()
  }, [list]);
  console.log(uploadList);
  const [form] = Form.useForm();
  const { Option } = Select;
  const goAdd = () => {
    handleChange(false, uploadList);
  };
  const delFile = (key: number) => {
    setUploadList((files) => files.filter((item, index) => key !== index));
    handleChange(false, uploadList);
  };

  const _uploadToExtension = () => {
    const _up = async (fileList) => {
      fileList.forEach((x) => {
        x.fileBinaryArrayBuffer = Buffer.from(x.fileBinaryArrayBuffer).buffer;
      });
      if (typeof (window.chrome as any).app.isInstalled !== "undefined") {
        const nulink = globalThis.nulink;
        nulink.sendMessage(
          {
            type: "uploadFilesCreatePolicy",
            data: {
              fileCategory: fileType,
              fileList,
            },
          },
          function (response) {
            const { data, error } = response;
            if (data) {
              const { id, label } = data;
              alert(`[upload success]: ${id}_${label}`);
            } else {
              alert(`[upload error]: ${error.data.msg}`);
            }
          },
        );
      }

      // try {
      //   await uploadFilesCreatePolicy(account, fileType, fileList);
      //   message.success(t("upload-success-a-title"));
      //   setTimeout(() => {
      //     Broker.closePopup();
      //   }, 1000 * 2);
      // } catch (error: any) {
      // console.error(error);
      // if (error?.data?.msg) {
      //   message.error(error?.data?.msg);
      // } else if (error?.data) {
      //   message.error(error?.data);
      // } else {
      //   message.error(error);
      // }
      // }
    };

    const __chooseObj = {
      1: () => {
        // Association policy upload
      },
      2: async () => {
        // // No associated policy upload
        const reader: FileReader = new FileReader();
        const [file] = uploadList;
        if (!!uploadList || (uploadList as listType).length <= 0) {
          Message.error("must be add a file");
          return;
        }

        reader.readAsArrayBuffer(file.originFileObj);
        reader.onloadend = (e: any) => {
          //If you pass the file from the Web side, use the BLOB object, just like the code for downloading the file
          const fileBinaryArrayBuffer = new Uint8Array(e?.target?.result)
            .buffer;
          _up([{ name: file.name, fileBinaryArrayBuffer }]);
        };
      },
    };
    __chooseObj[isAssociationStrategy]();
  };

  const _handleChangeSelect = (type, v) => {
    const _choseObj = {
      fileType: () => {
        setFileType(v);
      },
      policy: () => {},
    };
    _choseObj[type]();
  };

  const _getPublishedPolicyInfos = () => {
    const nulink = globalThis.nulink;
    nulink.sendMessage({ type: "getPublishedPolicyInfos" }, (data) => {
      setIdList(data.list);
      console.log(data, "[getPublishedPolicyInfos] ......");
    });
  };

  return (
    <>
      <Form
        form={form}
        labelAlign="right"
        labelCol={{
          span: 10,
          offset: 0,
        }}
        className={`upload_list_area ${uploadList.length > 0 ? "" : "visib"}`}
        wrapperCol={{ span: 14 }}
        onFinish={_uploadToExtension} // navigate("/uploadSuccess")
      >
        <div className="upload_list">
          <div className="upload_list_box">
            {/* <div className="upload_list_item item_title">
              <div>{t<string>("upload-list-a-title")}</div>
              <div onClick={goAdd}>{t<string>("upload-list-a-btn-1")}</div>
            </div> */}
            {uploadList.length > 0 &&
              uploadList.map((item, index) => {
                return (
                  <div className="upload_list_item" key={index}>
                    <div className="upload_list_item_left">
                      <img src={defaultImage} alt="" />
                      <div>
                        <div>{item.name}</div>
                        <div>{(item.size / (1024 * 1024)).toFixed(2)}M</div>
                      </div>
                    </div>
                    <div className="upload_list_item_right">
                      <CloseCircleFilled
                        style={{ fontSize: "18px", color: "#939CB0" }}
                        onClick={() => {
                          delFile(index);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="form_item">
            <Form.Item
              label={t<string>("upload-list-a-label-1")}
              tooltip="Add the tag that best describes your encrypted file to make it easier to find"
            >
              {fileType.length > 0 ? (
                <CloseButton
                  title={
                    locale.fields.fileCategory.filter(
                      (item) => fileType[0] === item.value,
                    )[0]?.label ?? fileType[0]
                  }
                  onClose={_handleChangeSelect.bind(this, "fileType", [])}
                />
              ) : (
                <Select
                  placeholder={t<string>("upload-list-a-label-1")}
                  style={selectStyle}
                  mode="tags"
                  defaultValue={fileType}
                  disabled={fileType.length > 0}
                  onChange={_handleChangeSelect.bind(this, "fileType")}
                >
                  {typeList.map((item) => (
                    <Option key={item} value={item}>
                      {FileCategory[item]}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={t<string>("upload-list-a-label-2")}>
              <Radio.Group
                value={isAssociationStrategy}
                onChange={({ target }) => {
                  setIsAssociationStrategy(target.value);
                }}
              >
                <Radio value={1} disabled={idList.length <= 0}>
                  {t<string>("upload-list-a-radio-1")}
                </Radio>
                <Radio value={2}>{t<string>("upload-list-a-radio-2")}</Radio>
              </Radio.Group>
            </Form.Item>
            {isAssociationStrategy === 1 && (
              <Form.Item label={t<string>("upload-list-a-label-3")}>
                <Select
                  placeholder={t<string>("upload-list-a-label-3")}
                  style={selectStyle}
                >
                  {idList.map((item, index) => {
                    return (
                      <Option key={index} value={item.label}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            <div className="form_btn">
              <Button htmlType="submit" style={btnStyle}>
                {t<string>("upload-list-a-btn-2")}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};
