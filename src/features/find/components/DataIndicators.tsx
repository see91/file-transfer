import "./styles/dataIndicators.less";
import { getTotalData } from "../api/dataIndicators";
import { useEffect, useState } from "react";

const DataIndicators = () => {
  const [data, setData] = useState<any>({});
  const _fetch = async () => {
    setData((await getTotalData()).data);
  };

  useEffect(() => {
    _fetch();
  }, []);

  return (
    <div className="data-indicators-area">
      <ul className="data-indicators">
        <li>
          <div className="title-logo">
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 4C9 6.20914 7.20914 8 5 8C2.79086 8 1 6.20914 1 4C1 1.79086 2.79086 0 5 0C7.20914 0 9 1.79086 9 4ZM7 4C7 2.89543 6.10457 2 5 2C3.89543 2 3 2.89543 3 4C3 5.10457 3.89543 6 5 6C6.10457 6 7 5.10457 7 4Z"
                fill="white"
              />
              <path
                d="M19 8.5C19 10.433 17.433 12 15.5 12C13.567 12 12 10.433 12 8.5C12 6.567 13.567 5 15.5 5C17.433 5 19 6.567 19 8.5ZM17 8.5C17 7.67157 16.3284 7 15.5 7C14.6716 7 14 7.67157 14 8.5C14 9.32843 14.6716 10 15.5 10C16.3284 10 17 9.32843 17 8.5Z"
                fill="white"
              />
              <path
                d="M8 18V14C8 12.3431 6.65685 11 5 11C3.34315 11 2 12.3431 2 14V18H0V14C0 11.2386 2.23858 9 5 9C7.76142 9 10 11.2386 10 14V18H8Z"
                fill="white"
              />
              <path
                d="M18 17.5V18H20V17.5C20 15.0147 17.9853 13 15.5 13C13.0147 13 11 15.0147 11 17.5V18H13V17.5C13 16.1193 14.1193 15 15.5 15C16.8807 15 18 16.1193 18 17.5Z"
                fill="white"
              />
            </svg>
            <span>Registered Users</span>
          </div>
          <span>{data?.account_total ?? "~"}</span>
        </li>
        <li>
          <div className="title-logo">
            <svg
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.9999 16.0001H5.99992C2.87429 16.002 0.270809 13.604 0.0162787 10.4887C-0.238251 7.37347 1.94144 4.58465 5.02592 4.07911C6.44563 1.562 9.11003 0.00362534 11.9999 5.65992e-05C13.8019 -0.00675485 15.5524 0.601415 16.9619 1.72411C18.346 2.82197 19.33 4.34509 19.7619 6.05811C22.3458 6.45514 24.1877 8.77563 23.9879 11.3822C23.7882 13.9888 21.6141 16.0015 18.9999 16.0001ZM11.9999 2.0001C9.83163 2.00267 7.83259 3.17221 6.76792 5.06111L6.29992 5.90011L5.35091 6.05511C3.3012 6.39852 1.85592 8.25441 2.02513 10.3258C2.19433 12.3972 3.92164 13.9939 5.99992 14.0001H18.9999C20.5685 14.0017 21.8735 12.7947 21.9941 11.2308C22.1147 9.66685 21.0102 8.27401 19.4599 8.03511L18.1439 7.83511L17.8219 6.54311C17.1572 3.86992 14.7545 1.99507 11.9999 2.0001ZM13.4499 12.0001H10.5499V9.00011H7.99992L11.9999 5.00011L15.9999 9.00011H13.4499V12.0001Z"
                fill="white"
              />
            </svg>
            <span>Files Uploaded</span>
          </div>
          <span>{data?.file_total ?? "~"}</span>
        </li>
        <li>
          <div className="title-logo">
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 20H2C0.89543 20 0 19.1046 0 18V2C0 0.89543 0.89543 0 2 0H9C9.0109 0.000472319 9.02167 0.00249256 9.032 0.006C9.04177 0.00901724 9.05182 0.0110277 9.062 0.012C9.15019 0.0176532 9.23726 0.0347982 9.321 0.063L9.349 0.072C9.37167 0.079682 9.39373 0.0890412 9.415 0.1C9.52394 0.148424 9.62321 0.216185 9.708 0.3L15.708 6.3C15.7918 6.38479 15.8596 6.48406 15.908 6.593C15.918 6.615 15.925 6.638 15.933 6.661L15.942 6.687C15.9699 6.77039 15.9864 6.85718 15.991 6.945C15.9926 6.95418 15.9949 6.96322 15.998 6.972C15.9998 6.98122 16.0004 6.99062 16.0001 7V18C16.0001 19.1046 15.1046 20 14 20ZM2 2V18H14V8H9C8.44772 8 8 7.55228 8 7V2H2ZM10 3.414V6H12.586L10 3.414Z"
                fill="white"
              />
            </svg>
            <span>File Sharing Count</span>
          </div>
          <span>{data?.file_share_total ?? "~"}</span>
        </li>
      </ul>
    </div>
  );
};

export default DataIndicators;
