import { lazyImport } from '@/utils/lazyImport';
const { Find } = lazyImport(() => import('@/features/find'), "Find");
const { FindDetail} = lazyImport(() => import('@/features/find'), "FindDetail");
const { UploadFile } = lazyImport(() => import('@/features/uploadFile'), "UploadFile");
const { UploadSuccess } = lazyImport(() => import('@/features/uploadFile'), "UploadSuccess");
const { MemberCenter } = lazyImport(() => import('@/features/memberCenter'), "MemberCenter");
const { ModifyData } = lazyImport(() => import('@/features/memberCenter'), "ModifyData");
const { Notice } = lazyImport(() => import('@/features/notice'), "Notice");
const { Faucet } = lazyImport(() => import('@/features/faucet'), "Faucet");
const { RankingList } = lazyImport(() => import('@/features/rankingList'), "RankingList");
const { Creator } = lazyImport(() => import('@/features/memberCenter'), "Creator");

export const routeConfig = [
  { path: "/", element: <Find /> },
  { path: "/find", element: <Find /> },
  { path: "/findDetail", element: <FindDetail /> },
  { path: "/uploadFile", element: <UploadFile /> },
  { path: "/uploadSuccess", element: <UploadSuccess /> },
  { path: "/memberCenter", element: <MemberCenter /> },
  { path: "/modifyData", element: <ModifyData /> },
  { path: "/notice", element: <Notice /> },
  { path: "/faucet", element: <Faucet /> },
  { path: "/ranking-list", element: <RankingList /> },
  { path: "/creator/:accountID", element: <Creator /> }
]