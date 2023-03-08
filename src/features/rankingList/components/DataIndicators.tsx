import "./styles/dataIndicators.less";
import { useEffect, useState } from "react";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import icon3 from "../assets/icon3.svg";
import { getRankingPeriods } from "../api/rankingList";

interface IProps {
  className?: string;
}

interface IPeriodData {
  list: Array<any>;
  total: number;
}

const DataIndicators = (props: IProps) => {
  const [periodData, setPeriodData] = useState<IPeriodData>({
    list: [],
    total: 0,
  });

  const _fetch = async () => {
    _getRankingPeriods();
  };

  const _getRankingPeriods = async () => {
    const _data: any = [];
    const { data } = await getRankingPeriods();
    data.list.forEach((x) => {
      if (x.period !== -1) {
        _data.push(x);
      }
    });
    setPeriodData({ list: _data, total: data.total });
  };

  useEffect(() => {
    _fetch();
  }, []);

  return (
    <ul className={`ranking-list-data-indicators ${props.className || ""}`}>
      <li>
        <img src={icon1} alt="" />
        <div>
          <span>Bonus of this week</span>
          <span>10000.00NLK</span>
        </div>
      </li>
      <li>
        <img src={icon2} alt="" />
        <div>
          <span>Accumulated bonus paid</span>
          <span>
            50000 NLK
            {/* {periodData.total > 0 ? (periodData.total - 1) * 10000 : 0}NLK */}
          </span>
        </div>
      </li>
      <li>
        <img src={icon3} alt="" />
        <div>
          <span>Number of issued periods</span>
          <span>5 periods</span>
          {/* <span>{periodData.total > 0 ? periodData.total - 1 : 0} periods</span> */}
        </div>
      </li>
    </ul>
  );
};

export default DataIndicators;
