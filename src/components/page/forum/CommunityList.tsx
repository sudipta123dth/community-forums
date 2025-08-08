import { TblCommunity } from '@/interface/database';
import Link from 'next/link';

const CommunityList = (props: Props) => {
    const { communityList, userId } = props

    return (
        <div className="flex justify-center items-center px-4 py-8">
            <div className="w-full max-w-3xl space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center">
                    Your Communities
                </h2>

                <div className="flex flex-col gap-4">
                    {communityList.length > 0 ? (
                        communityList.map((d) => (
                            <Link
                                href={`/question/${userId}/${d.CommunityId}`}
                                key={`com-${d.CommunityId}`}
                            >
                                <div className="border border-gray-300 hover:border-green-500 px-6 py-4 rounded-lg transition duration-200 hover:bg-green-50 cursor-pointer">
                                    <p className="text-xl font-semibold text-gray-800">
                                        {d.CommunityName}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Created on:</span>{" "}
                                        {d.CreatedOn}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-lg">
                            You have no community to show.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

interface Props {
    communityList: TblCommunity[];
    userId: string;
}

export default CommunityList