
import ServerApi from "@/api/Server";
import AnswerPage from "@/components/page/answer/AnswerPage";
import Pagination from "@/interface/common/Pagination";
import TblAnswer from "@/interface/database/TblAnswer";
import Image from "next/image";
import { Suspense } from "react";

type Props = {
  params: Promise<{ userId: string; communityId: number, CQId: number }>;
};

const questionApi = new ServerApi({ spName: "spCommunityForumAnonymous", mode: 6 });
const answerApi = new ServerApi({ spName: "spCommunityForumAnonymous", mode: 7 });


async function Home(props: Props) {

  const params = await props.params;


  const questionRes = await questionApi
    .request({
      CommunityUserId: params.userId,
      CommunityId: params.communityId,
      CQId: params.CQId,
    })
  const qusJson = JSON.parse(questionRes.result)

  const questions = questionRes.isSuccess && !!qusJson ? qusJson[0] : {};


  const ansRes = await answerApi
    .request({
      CommunityUserId: params.userId,
      CQId: params.CQId,
      PageSize: 5,
      PageIndex: 1,
    })

  const ansJson = ansRes.isSuccess ? JSON.parse(ansRes.result ?? '[]') : [];
  const answerList: TblAnswer[] = ansJson[0]?.Answers ?? [];
  const page = JSON.parse(ansJson[0]?.PaginationData ?? '{}');
  const pagination: Pagination = {
    PageIndex: page?.PageIndex ?? 1,
    NoOfPages: page?.NoOfPages ?? 1,
    PageSize: page?.PageSize ?? 5,
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center my-auto">
        <Image
          height={100}
          width={100}
          src='/static/Rolling@1x-0.4s-200px-200px.svg'
          alt="animation"
        />
      </div>
    }>
      <AnswerPage
        question={questions}
        answerList={answerList}
        userId={String(params.userId)}
        pagination={pagination}
      />
    </Suspense>
  );
}

export default Home;
