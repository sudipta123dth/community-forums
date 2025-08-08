import ServerApi from "@/api/Server";
import QuestionPage from "@/components/page/question/QuestionPage";
import Pagination from "@/interface/common/Pagination";

type Props = {
  params: Promise<{ userId: string; communityId: number }>;
};

const communityApi = new ServerApi({
  spName: "spCommunityForumAnonymous",
  mode: 3,
});

const questionApi = new ServerApi({
  spName: "spCommunityForumAnonymous",
  mode: 2,
});

const userApi = new ServerApi({
  spName: "spCommunityForumAnonymous",
  mode: 8,
});



async function page({ params }: Props) {
  const { userId, communityId } = await params;

  const comRes = await communityApi.request({
    UserId: userId,
    CommunityId: communityId,
  });

  const questionRes = await questionApi.request({
    CommunityId: communityId,
    CommunityUserId: userId,
    PageSize: 5,
    PageIndex: 1,
  })

  const userRes = await userApi.request({
    CommunityId: communityId,
  })


  const comJson = JSON.parse(comRes.result)
  const qusJson = JSON.parse(questionRes.result)

  const communityTag = comRes.isSuccess && !!comJson ? comJson[0].CommunityTags : [];
  const communityName = comRes.isSuccess && !!comJson ? comJson[0].CommunityName : '';
  const userData = userRes.isSuccess ? JSON.parse(userRes.result)[0] : {}

  const qusData = questionRes.isSuccess && !!qusJson ? qusJson[0] : {}

  const questionList = qusData.Questions || [];
  const page = JSON.parse(qusData?.PaginationData ?? '{}')
  const pagination: Pagination = {
    PageSize: page?.PageSize ?? 5,
    PageIndex: page?.PageIndex ?? 1,
    NoOfPages: page?.NoOfPages ?? 1,
  }

  return (
    <>
      <div className="flex justify-center items-center">
        {comRes.isSuccess ? <QuestionPage
          userId={userId}
          communityId={communityId}
          communityName={communityName}
          CommunityTags={communityTag}
          QuestionList={questionList}
          Pagination={pagination}
          UserData={userData}
        /> : <p>{comRes.errorMessages?.join(', ')}</p>}
      </div>
    </>
  );
}

export default page;
