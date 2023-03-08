import { Col, Row, Table } from "antd";
import { Pagination } from "@mui/material";
import "../assets/myUpload.less";
import {
  defaultImage,
  defaultImageHandler,
  defaultAvatarImage,
} from "@/utils/defaultImage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccountUploadedFiles,
  type AccountUploadedFilesRequestOptions,
} from "../api/account";
import { getThumbnailBase64 } from "@/utils/image";
import {
  getAvatarBase64String,
  getUserCache,
  getUserDetailCache,
} from "@/features/auth/api/getLoginedUserInfo";
import { locale } from "@/config";

export const MyUpload = () => {
  const [resultList, setResultList] = useState<any>([]);
  const [avatar, setAvatar] = useState(defaultAvatarImage);
  const [userDetailInfo, setUserDetails] = useState<any>({});
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [user, setUser] = useState(null);

  const _getAccountUploadedFiles = async (val) => {
    setPageIndex(val);

    const params: AccountUploadedFilesRequestOptions = {
      pageIndex: val,
      pageSize,
    };
    const result = await getAccountUploadedFiles(params);

    dealWithResultList(result);
  };

  const pageChange = async (e, val) => {
    // setPageIndex(val);
    await _getAccountUploadedFiles(val);
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

  useEffect(() => {
    const user = getUserCache();
    setUser(user);

    if (!user) {
      return;
    }

    const userDetailInfo = getUserDetailCache();
    setUserDetails(userDetailInfo);

    (async () => {
      if (!!userDetailInfo && !!userDetailInfo.avatar) {
        const avatarStr = await getAvatarBase64String(userDetailInfo.avatar);
        setAvatar(avatarStr);
      }

      await _getAccountUploadedFiles(1);
    })();
  }, []);

  return (
    <div>
      <div className="my_upload_content">
        <Row>
          {resultList.map((file: any) => (
            <div
              key={file.file_id}
              className="content_box"
              onClick={() =>
                navigate("/findDetail", {
                  state: { file: file, hide: false, user: user },
                })
              }
            >
              {!file.useThumbnailBase64 ? (
                <div className="file_img_area">
                  <img
                    style={{
                      display: "inline-block",
                      width: "75px",
                      height: "fit-content",
                    }}
                    src={file.src || defaultImage}
                    onError={defaultImageHandler}
                    alt=""
                  />
                </div>
              ) : (
                <img src={file.src} alt="" />
              )}
              <div className="content_box_middle" title={file.file_name}>
                {file.file_name}
              </div>
              <div className="content_box_bottom">
                <div className="content_box_bottom_left">
                  <img src={avatar} alt="" />
                  {file.owner}
                </div>
                {/* <div className="content_box_bottom_right">
                    <img src={imgUrl} alt="" />
                    0
                  </div> */}
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
          count={total ? Math.ceil(total / pageSize) : 1}
          onChange={pageChange}
        />
      </div>
    </div>
  );
};
