import { useEffect, useState } from "react";
import "./styles/weeklyRankingList.less";
import { Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import rank1 from "../assets/rank1.svg";
import rank2 from "../assets/rank2.svg";
import rank3 from "../assets/rank3.svg";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Layout/Loading";
import { getAvatarBase64String } from "@/features/auth/api/getLoginedUserInfo";
import { defaultAvatarImage } from "@/utils/defaultImage";
import { getRankingPeriods, getRankingPeriodsData } from "../api/rankingList";
import { toDisplayAddress } from "@/utils/format";
import { url } from "inspector";

interface IPeriodData {
  list: Array<any>;
  total: number;
}

interface IRankingListData {
  list: Array<any>;
  total: number;
}

const { Option } = Select;
const rankIcon = {
  0: rank1,
  1: rank2,
  2: rank3,
};

const WeeklyRankingList = () => {
  const [period, setPeriod] = useState<string | number>("5");
  const [ocpd, setOcpd] = useState<any>({});
  const navigate = useNavigate();
  const [resultList, setResultList] = useState<any>([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [oneCurrentPeriodData, setOneCurrentPeriodData] = useState<any>({});
  const [periodData, setPeriodData] = useState<IPeriodData>({
    list: [],
    total: 0,
  });

  const handleChange = (value: string) => {
    setPeriod(value || "");
    _getRankingPeriodsData(value || "");
    if (!value) {
      setOneCurrentPeriodData(ocpd);
    } else {
      const [selectPeriodsData] = periodData.list.filter(
        (x) => x.period === value,
      );
      setOneCurrentPeriodData(selectPeriodsData);
    }
  };

  const _getRankingPeriods = async () => {
    const _data: any = [];
    const { data } = await getRankingPeriods();
    data.list.forEach((x) => {
      if (x.period !== -1) {
        _data.push(x);
      } else {
        setOcpd(x);
        setOneCurrentPeriodData(x);
      }
    });
    setPeriodData({ list: _data, total: data.total });
  };

  const deduplication = (arr) => {
    const obj = {};
    return arr.reduce((prev, cur) => {
      if (!obj[cur.account_id]) {
        obj[cur.account_id] = true && prev.push(cur);
      }
      return prev;
    }, []);
  };

  const dealWithResultList = (result) => {
    setResultList([]);
    if (result.list.length > 0) {
      result.list.forEach(async (item) => {
        if (!!item.account_avatar) {
          const avatarStr = await getAvatarBase64String(item.account_avatar);
          if (!!avatarStr) {
            item.avatar = avatarStr;
          }
        }
        setResultList((pre) => {
          pre.push(item);
          return deduplication(pre).sort(
            (a, b) => b.share_total - a.share_total,
          );
        });
      });
    } else {
      setResultList([]);
    }
    setShowLoading(false);
  };

  const _getRankingPeriodsData = async (period?) => {
    setShowLoading(true);
    const { data } = await getRankingPeriodsData({
      period: period ? Number(period) : -1,
    });
    dealWithResultList(data);
  };

  const _fetch = () => {
    _getRankingPeriods();
    _getRankingPeriodsData(period);
  };

  useEffect(() => {
    _fetch();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "Ranking",
      width: 200,
      align: "center",
      render: (_, __, index) => {
        if (index <= 2) {
          return (
            <div className="flex-center">
              <img src={rankIcon[index]} className="rank-icon" alt="" />
              <span className="d-t">{index + 1}</span>
            </div>
          );
        }
        return index + 1;
      },
    },
    {
      title: "User",
      dataIndex: "account_name",
      key: "account_name",
      align: "center",
      width: 200,
      render: (_, record) => {
        return (
          <div
            className="user-info"
            onClick={() => {
              navigate(`/creator/${record.account_id}`);
            }}
          >
            <div
              className="img-area"
              style={{
                backgroundImage: `url(${record.avatar || defaultAvatarImage})`,
              }}
            />
            <div>
              <span>{record.account_name}</span>
              <span>{toDisplayAddress(record.account_address)}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Number of files uploaded",
      dataIndex: "file_total",
      key: "file_total",
      align: "center",
      width: 200,
      render: (_, record, index) => {
        if (index <= 2) {
          return <div className="d-t">{record.file_total}</div>;
        }
        return record.file_total;
      },
    },
    {
      title: "File sharing times",
      dataIndex: "share_total",
      key: "share_total",
      width: 200,
      align: "center",
      render: (_, record, index) => {
        if (index <= 2) {
          return <div className="d-t">{record.share_total}</div>;
        }
        return record.share_total;
      },
    },
  ];

  return (
    <>
      <div className="weekly-ranking-list">
        <div className="w-title">Weekly Ranking List</div>
        <div className="statistical-time">
          Statistical Time:{" "}
          <span>
            {oneCurrentPeriodData.start_time
              ? dayjs(oneCurrentPeriodData.start_time).format("YYYY.MM.DD")
              : "~"}
            -
            {oneCurrentPeriodData.end_time
              ? dayjs(oneCurrentPeriodData.end_time).format("YYYY.MM.DD")
              : "~"}
          </span>
        </div>
        <div className="func-area">
          {/* <button
            className={`${period === "" ? "week-st" : ""}`}
            onClick={() => {
              setPeriod("");
              setOneCurrentPeriodData(ocpd);
              _getRankingPeriodsData(-1);
            }}
          >
            This week
          </button> */}
          {/* <button
            className={`${period === -1 ? "" : "week-st"}`}
            onClick={_getRankingPeriodsData.bind(this, -1)}
          >
            Last week
          </button> */}
          <Select
            style={{ width: 150, height: 40 }}
            placeholder="Select Period"
            className="select-period"
            onChange={handleChange}
            value={String(period)}
          >
            {/* <Option value="">Select Period</Option> */}
            {periodData.total > 0 &&
              periodData.list.map((x) => (
                <Option value={x.period}>{x.period}</Option>
              ))}
          </Select>
        </div>
      </div>
      <Table
        style={{ width: "100%" }}
        columns={columns}
        dataSource={resultList}
        pagination={false}
      />
      {showLoading && <Loading />}
    </>
  );
};

export default WeeklyRankingList;
