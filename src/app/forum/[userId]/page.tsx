import ServerApi from "@/api/Server";
import CommunityList from "@/components/page/forum/CommunityList";
import ApiResponse from "@/interface/common/ApiResponse";
import { TblCommunity } from "@/interface/database";
import { Suspense } from "react";

type Props = { params: Promise<{ userId: string }> };


export default async function Page({ params }: Props) {

  const { userId } = await params;

  const server = new ServerApi({ spName: "spCommunityForumAnonymous", mode: 1 });
  const json: ApiResponse = await server.request({
    CommunityUserId: userId,
  });

  const result = JSON.parse(json?.result)
  const communityList: TblCommunity[] = !!json.isSuccess && !!result ? result : []


  return (
    <div className="m-4 p-2">
      <Suspense
        fallback={
          <div className="text-center py-4 text-gray-600">
            Loading forum...
          </div>
        }
      >
        <CommunityList communityList={communityList} userId={userId} />
      </Suspense>
    </div>
  );
}
