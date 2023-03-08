import { Col, Row, Table } from "antd";
import { Pagination } from "@mui/material";
import { DoubleLeftOutlined } from "@ant-design/icons";
import {
  defaultImageHandler,
  defaultImage,
  defaultAvatarImage,
} from "@/utils/defaultImage";
import { formatDate, betweenDays } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import "../assets/myApply.less";
import "../assets/myStrategy.less";
import { t } from "i18next";
import { useState, useEffect } from "react";
import {
  getPublishedPolicyInfos,
  getPolicyInfosAsUser,
  type PublishedPolicyInfosRequestOptions,
  getFilesInfoOfPolicy,
  type FilesInfoOfPolicyRequestOptions,
} from "../api/strategy";
import { getThumbnailBase64 } from "@/utils/image";
import {
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import OvalButton from "@/components/Button/OvalButton";

export const MyStrategy = () => {
  const navigate = useNavigate();
  const [strategyList, setStrategyList] = useState([]);
  const [total, setTotal] = useState(0);
  const [isUser, setIsUser] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [policyFileList, setFileList] = useState([]);
  const [policyId, setPolicyId] = useState("");
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getUserCache();
    setUser(user);

    if (!user) {
      return;
    }

    if (isUser) {
      _getPolicyInfosAsUser(1);
    } else {
      _getPublishedPolicyInfos(1);
    }
  }, [isUser]);
  const changeRole = (role: string) => {
    if (isDetail) {
      return;
    }
    setPageIndex(1);
    if (role === "0") {
      setIsUser(false);
    } else {
      setIsUser(true);
    }
  };
  const _getPublishedPolicyInfos = async (val: number) => {
    const params: PublishedPolicyInfosRequestOptions = {
      pageIndex: val,
      pageSize,
    };
    console.log(params);
    const result = await getPublishedPolicyInfos(params);
    setStrategyList(result?.list || []);
    setTotal(result?.total || 0);
    console.log(result);
  };
  const _getPolicyInfosAsUser = async (val) => {
    const params: PublishedPolicyInfosRequestOptions = {
      pageIndex: val,
      pageSize,
    };
    console.log(params);
    const result = await getPolicyInfosAsUser(params);
    setStrategyList(result?.list || []);
    setTotal(result?.total || 0);
    console.log(result);
  };

  const _getFilesInfoOfPolicy = async (policyId) => {
    const params: FilesInfoOfPolicyRequestOptions = {
      policyId: policyId,
      pageIndex: 1,
      pageSize: 100,
    };
    let result = await getFilesInfoOfPolicy(params);

    //An important line, preFiles is the fileList current value in this time of useEffect, don't use the fileList because it update in next time of useEffect
    setFileList((preFiles) => []);

    result?.list?.forEach(async (item: Record<string, any>, index: number) => {
      if (!!item.owner_avatar) {
        const avatarStr = await getAvatarBase64String(item.owner_avatar);
        if (!!avatarStr) {
          item.owner_avatar = avatarStr;
        }
      }

      if (!!item.thumbnail) {
        const thumbnailBase64 = await getThumbnailBase64(item.thumbnail);
        if (!!thumbnailBase64) {
          item.src = thumbnailBase64;
        }
      } else {
        item.src = defaultImage;
      }

      //https://stackoverflow.com/questions/57685934/with-a-react-hook-trying-to-fetch-multiple-datas-using-foreach#fromHistory
      //An important line, preFiles is the fileList current, don't use the fileList because is async
      // setFileList(preFiles => ([...preFiles, { ...item }]));

      setFileList((preFiles) => {
        // console.log("preFiles: ", preFiles);

        let files: any = [];
        preFiles.forEach((element: any) => {
          // console.log(
          //   `element file_id: ${element.file_id}, item file_id: ${
          //     item.file_id
          //   }, is equal: ${item.file_id === element.file_id}`,
          // );
          if (element.file_id !== item.file_id) {
            files.push(element);
          }
        });

        files.push(item);
        return files;
      });
    });
  };

  const pageChange = async (e, val) => {
    setPageIndex(val);
    if (isUser) {
      _getPolicyInfosAsUser(val);
    } else {
      _getPublishedPolicyInfos(val);
    }
  };
  const columns = [
    // {
    //   title: `${t<string>("member-center-apply-table-title-1")}`,
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   render: (_, record) => formatDate(record.created_at * 1000),
    // },
    {
      title: `${t<string>("member-center-s-table-title-2")}`,
      dataIndex: "policy_id",
      key: "policy_id",
    },
    // {
    //   title: `${t<string>("member-center-s-table-title-3")}`,
    //   dataIndex: "creator_address",
    //   key: "creator_address",
    //   align: "center" as "center",
    // },
    {
      title: `${t<string>("member-center-s-table-title-4")}`,
      dataIndex: "consumer_address",
      key: "consumer_address",
    },
    // {
    //   title: `${t<string>("member-center-apply-table-title-3")}`,
    //   dataIndex: "useDay",
    //   key: "useDay",
    //   align: "center" as "center",
    //   render: (_, record) => {
    //     return betweenDays(record.start_at, record.end_at);
    //   },
    // },
    // {
    //   title: `${t<string>("member-center-s-table-title-6")}`,
    //   dataIndex: 'status',
    //   key: 'status',
    // },
    {
      // title: `${t<string>("member-center-s-table-title-7")}`,
      dataIndex: "oprate",
      key: "oprate",
      render: (txt, record, index) => {
        return (
          <OvalButton
            title={t<string>("member-center-s-table-btn")}
            onClick={() => {
              setPolicyId(record.policy_id);
              _getFilesInfoOfPolicy(record.policy_id);
              setIsDetail(true);
            }}
          />
        );
      },
    },
  ];
  const columns1 = [
    {
      title: `${t<string>("member-center-s-table-title-2")}`,
      dataIndex: "policy_id",
      key: "policy_id",
    },
    {
      title: `${t<string>("member-center-s-table-title-3")}`,
      dataIndex: "creator_address",
      key: "creator_address",
    },
    {
      dataIndex: "oprate",
      key: "oprate",
      render: (txt, record, index) => {
        return (
          <OvalButton
            title={t<string>("member-center-s-table-btn")}
            onClick={() => {
              setPolicyId(record.policy_id);
              _getFilesInfoOfPolicy(record.policy_id);
              setIsDetail(true);
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="my_apply my_strategy">
      {!isDetail && (
        <div className="my_strategy_top">
          <div
            className={isUser ? "" : "active"}
            onClick={() => changeRole("0")}
          >
            {t<string>("member-center-s-btn-1")}
          </div>
          <div
            className={isUser ? "active" : ""}
            onClick={() => changeRole("1")}
          >
            {t<string>("member-center-s-btn-2")}
          </div>
        </div>
      )}
      {!isDetail && (
        <>
          <div className="my_apply_table">
            <Table
              columns={isUser ? columns1 : columns}
              dataSource={strategyList}
              pagination={false}
            />
          </div>
          <div className="pagination">
            <Pagination
              count={total ? Math.ceil(total / pageSize) : 1}
              onChange={pageChange}
            />
          </div>
        </>
      )}
      {isDetail && (
        <div className="my_strategy_detail">
          <div className="my_strategy_detail_title">
            <span
              onClick={() => {
                setIsDetail(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <DoubleLeftOutlined
                style={{ marginRight: "4px", cursor: "pointer" }}
              />
              {t<string>("member-center-goback")}
            </span>
            <span>
              {t<string>("member-center-s-text-1")}（{policyFileList.length}）
            </span>
            <span>
              {t<string>("member-center-s-text-2")}：{policyId}
            </span>
          </div>
          <div className="my_strategy_detail_list">
            <Row>
              {policyFileList.map((file: any) => (
                <Col span="6" key={file.file_id}>
                  <div
                    className="content_box"
                    onClick={() =>
                      navigate("/findDetail", {
                        state: { file: file, hide: false, user: user },
                      })
                    }
                  >
                    <img
                      src={file.src}
                      alt="thumbnail"
                      onError={defaultImageHandler}
                    />
                    <div className="content_box_middle">{file.file_name}</div>
                    <div className="content_box_bottom">
                      <div className="content_box_bottom_left">
                        <img
                          src={file.owner_avatar || defaultAvatarImage}
                          alt="avatar"
                        />
                        {file.owner}
                      </div>
                      {/* <div className="content_box_bottom_right">
                        <img src={imgUrl} alt="" />
                        0
                      </div> */}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};
