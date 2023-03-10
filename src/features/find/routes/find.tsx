import "../assets/index.less";
import { Row, Form, Input, Select, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { defaultImage, defaultAvatarImage } from "@/utils/defaultImage";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { locale } from "@/config";
import { SearchOutlined } from "@ant-design/icons";
import { getFileList, type FileListRequestOptions } from "../api/find";
import { getThumbnailBase64 } from "@/utils/image";
import {
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import OvalButton from "@/components/Button/OvalButton";
import CloseButton from "@/components/Button/CloseButton";
import { Pagination } from "@mui/material";
import DataIndicators from "../components/DataIndicators";

const { Option } = Select;
const formItemStyle = {
  marginRight: "20px",
};
const selectStyle = {
  width: "200px",
};
const inputStyle = {
  width: "300px",
  height: "40px",
  borderRadius: "20px",
  border: "none",
  paddingRight: "60px",
};

const fileImgAreaStyle = {
  width: "75px",
  height: "fit-content",
  display: "inline-block",
};

export const ownedStyle = {
  border: "1px solid #ECECEC",
  borderRadius: "0px",
  padding: "2px 6px",
  color: "black",
  background: "ghostwhite",
};

export const Find = () => {
  const pageSize = 12;
  const [pageIndex, setPageIndex] = useState(1);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({});
  const [user, setUser] = useState<any>(null);
  const [resultList, setResultList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [fileCategory, setFileCategory] = useState<any>([]);
  const [fileType, setFileType] = useState<any>(undefined);

  const [fileName, setFileName] = useState<string>("");
  const [descOrder, setDescOrder] = useState<boolean>(true);

  // let timer: number | null = null;

  const toFindDetail = (fileDetail, user) => {
    navigate("/findDetail", { state: { file: fileDetail, user: user } });
  };

  const handleInput = (e) => {
    setFileName(e.target.value);
  };

  const search = async (values: FileListRequestOptions = {}) => {
    //get user info
    // const user = getUserCache();
    // setUser(user);

    // if (!user) {
    //   return;
    // }
    // console.log("user: ", user);

    if (Array.isArray(values.fileCategory)) {
      values.fileCategory = values.fileCategory[0];
    }

    setPageIndex(1);
    setSearchValues(values);
    let result = await getFileList({
      ...values,
      pageSize,
      pageIndex: 1,
      include: true,
    });
    dealWithResultList(result);
  };

  const deduplication = (arr) => {
    const obj = {};
    return arr.reduce((prev, cur) => {
      if (!obj[cur.file_id]) {
        obj[cur.file_id] = true && prev.push(cur);
      }
      return prev;
    }, []);
  };

  const dealWithResultList = (result) => {
    setResultList([]);
    if (result.list.length > 0) {
      result.list.forEach(async (item) => {
        if (!!item.owner_avatar) {
          const avatarStr = await getAvatarBase64String(item.owner_avatar);
          if (!!avatarStr) {
            item.owner_avatar = avatarStr;
          }
        }

        if (!!item.thumbnail) {
          item.src = await getThumbnailBase64(item.thumbnail);
          item.useThumbnailBase64 = true;
        } else {
          item.src = locale.messages.suffixs[item.suffix]
            ? require(`../../../assets/img/${
                locale.messages.suffixs[item.suffix]
              }.png`)
            : null;
        }
        setResultList((pre) => {
          pre.push(item);
          return deduplication(pre).sort((a, b) => b.created_at - a.created_at);
        });
      });
      setTotal(result.total);
    } else {
      setResultList([]);
      setTotal(0);
    }
  };

  const pageChange = async (e, val) => {
    setPageIndex(val);
    let result = await getFileList({
      ...searchValues,
      pageSize,
      pageIndex: val,
      include: true,
    });
    dealWithResultList(result);
  };

  useEffect(() => {
    (async () => {
      await search();
    })();
  }, [navigate]);

  const handleTypeChange = (type, e) => {
    const obj = {
      add: async () => {
        setFileCategory(e);
        await search({
          fileName,
          fileCategory: e,
          fileType,
          descOrder,
          pageIndex: 1,
          pageSize,
        });
      },
      remove: async () => {
        form.setFieldsValue({ fileCategory: [] });
        setFileCategory([]);
        await search({
          fileName,
          fileCategory: "",
          fileType,
          descOrder,
          pageIndex: 1,
          pageSize,
        });
      },
    };
    obj[type]();
  };
  const handleFormatChange = (type, e) => {
    const obj = {
      add: async () => {
        setFileType(e);
        await search({
          fileName,
          fileCategory,
          fileType: e,
          descOrder,
          pageIndex,
          pageSize,
        });
      },
      remove: async () => {
        form.setFieldsValue({ fileType: undefined });
        setFileType(undefined);
        await search({
          fileName,
          fileCategory,
          fileType: undefined,
          descOrder,
          pageIndex,
          pageSize,
        });
      },
    };
    obj[type]();
  };
  const handleLastChange = (e) => {
    setDescOrder(e);
  };

  const _uploadAction = () => {
    // http://localhost:3000/upload-file
    // if (typeof (window.chrome as any).app.isInstalled !== "undefined") {
    //   const nulink = globalThis.nulink;
    //   nulink.sendMessage({ type: "uploadFilesCreatePolicyByWeb" });
    // }
  };

  const _filterQuery = (key, value) => {
    const keyObj = {
      fileCategory: async () => {
        setFileCategory([value]);
        await search({
          fileName,
          fileCategory: value,
          fileType,
          descOrder,
          pageIndex,
          pageSize,
        });
      },
      fileType: async () => {
        const [data] = locale.fields.fileType.filter(
          (x) => x.label.toLocaleLowerCase() === value.toLocaleLowerCase(),
        );
        setFileType(data.value);
        await search({
          fileName,
          fileCategory,
          fileType: String(data.value),
          descOrder,
          pageIndex,
          pageSize,
        });
      },
    };
    keyObj[key]();
  };

  return (
    <div className="find_page reactive">
      <DataIndicators />
      <div className="find_page_search">
        <div style={{ display: "flex" }}>
          <Input
            prefix={
              <SearchOutlined style={{ fontSize: "20px", color: "#7A7A7A" }} />
            }
            onChange={handleInput}
            style={{ ...inputStyle, ...formItemStyle }}
            placeholder={t<string>("find-a-input-placeholder")}
          />
          {fileCategory.length > 0 ? (
            <CloseButton
              title={
                locale.fields.fileCategory.filter(
                  (item) => fileCategory[0] === item.value,
                )[0]?.label ?? fileCategory[0]
              }
              onClose={handleTypeChange.bind(this, "remove")}
            />
          ) : (
            <Select
              mode="tags"
              style={{ ...selectStyle, ...formItemStyle }}
              placeholder={t<string>("find-a-select-placeholder-1")}
              onChange={handleTypeChange.bind(this, "add")}
              disabled={fileCategory.length > 0}
            >
              {locale.fields.fileCategory.map((item, index) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
          {fileType || Number(fileType) === 0 || fileType === "" ? (
            <CloseButton
              title={
                locale.fields.fileType.filter(
                  (item) => fileType === item.value,
                )[0].label
              }
              onClose={handleFormatChange.bind(this, "remove")}
            />
          ) : (
            <Select
              style={{ ...selectStyle, ...formItemStyle }}
              placeholder={t<string>("find-a-select-placeholder-2")}
              onChange={handleFormatChange.bind(this, "add")}
            >
              {locale.fields.fileType.map((item, index) => {
                return (
                  <Option key={item.label} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          )}
          <Select
            style={{ ...selectStyle, ...formItemStyle }}
            placeholder={t<string>("find-a-select-placeholder-3")}
            onChange={handleLastChange}
          >
            {locale.fields.descOrder.map((item, index) => {
              return (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
          <OvalButton
            title={t<string>("find-a-search-btn")}
            onClick={async () => {
              await search({
                fileName,
                fileCategory,
                fileType,
                descOrder,
                pageIndex,
                pageSize,
              });
            }}
          />
        </div>
        <OvalButton
          title={t<string>("header-a-tab-2")}
          onClick={_uploadAction}
        />
      </div>
      <div className="find_page_content">
        <Row>
          {resultList.length > 0 &&
            resultList.map((file: any, index) => (
              <div className="content_box" key={file.file_id}>
                {!file.useThumbnailBase64 ? (
                  <div
                    className="file_img_area"
                    onClick={() => toFindDetail(file, user)}
                  >
                    <img
                      style={fileImgAreaStyle}
                      src={file.src || defaultImage}
                      alt=""
                    />
                  </div>
                ) : (
                  <img
                    src={file.src}
                    alt=""
                    onClick={() => toFindDetail(file, user)}
                  />
                )}

                <div className="content_box_middle nowrap">
                  <p>{file.file_name}</p>
                  <div className="tag">
                    {file.category && (
                      <span
                        onClick={_filterQuery.bind(
                          this,
                          "fileCategory",
                          file.category,
                        )}
                      >
                        {file.category}
                      </span>
                    )}
                    {file.format && (
                      <span
                        onClick={_filterQuery.bind(
                          this,
                          "fileType",
                          file.format,
                        )}
                      >
                        {file.format}
                      </span>
                    )}
                  </div>
                </div>
                <div className="content_box_bottom">
                  <div
                    className="content_box_bottom_left"
                    onClick={() => {
                      navigate(`/creator/${file.owner_id}`);
                    }}
                  >
                    <img
                      src={file.owner_avatar || defaultAvatarImage}
                      alt="avatar"
                      width="256"
                    />
                    {file.owner}
                  </div>
                  <div className="content_box_bottom_right">
                    {/* <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.11231 0.88086C6.11231 0.393165 6.50762 0 6.99317 0C7.48087 0 7.87403 0.393164 7.87403 0.878712V5.90177L8.96114 4.81465C9.30489 4.4709 9.86134 4.4709 10.2051 4.81465C10.5488 5.1584 10.5488 5.71485 10.2051 6.0586L7.64958 8.61411C7.48814 8.79429 7.25364 8.90743 6.99317 8.90743C6.72397 8.90743 6.48357 8.78698 6.3222 8.59739L3.77051 6.04571C3.42676 5.70196 3.42676 5.14551 3.77051 4.80176C4.11426 4.45801 4.67071 4.45801 5.01446 4.80176L6.11231 5.89962V0.88086ZM12.2139 9.16954C12.2139 8.68185 12.6092 8.28868 13.0947 8.28868C13.5803 8.28868 13.9756 8.68185 13.9735 9.17169V10.8238C13.9004 11.5156 13.3461 12.0656 12.6522 12.1279H1.29981C0.599415 12.0527 0.0494141 11.4834 0 10.7744V9.17169C0 8.684 0.393165 8.29083 0.88086 8.29083C1.36856 8.29083 1.76172 8.68614 1.76172 9.17169V9.90001C1.7961 10.132 1.97227 10.3168 2.2 10.3662H11.752C11.984 10.3297 12.1666 10.1535 12.2139 9.92579V9.16954Z" fill="#7D92FF" />
                    </svg>
                    <span className="ml_4">0</span> */}
                    <span
                      className="ml_4 "
                      style={file.owned ? ownedStyle : {}}
                    >
                      {file.owned ? "owner" : ""}
                    </span>
                    {/* <span className="ml_4">''</span> */}
                  </div>
                </div>
              </div>
            ))}
        </Row>
        {resultList.length === 0 && (
          <Table dataSource={resultList} pagination={false} />
        )}
      </div>
      <div className="pagination">
        <Pagination
          page={pageIndex}
          count={total ? Math.ceil(total / pageSize) : 1}
          onChange={pageChange}
        />
      </div>
    </div>
  );
};
