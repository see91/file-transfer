import "../assets/style/rankingList.less";
import DataIndicators from "../components/DataIndicators";
import WeeklyRankingList from "../components/WeeklyRankingList";

export const RankingList = () => {
  return (
    <div className="ranking-list-contriner">
      <div className="main-layout ranking-list">
        <div className="main-content">
          <h2 className="ranking-list-title">File Sharing Ranking List</h2>
          <DataIndicators className="m-t-60" />
          <WeeklyRankingList />
        </div>
      </div>
    </div>
  );
};
