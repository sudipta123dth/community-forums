
import PageBack from "@/components/common/PageBack";
import { TblQuestion } from "@/interface/database";
import Image from "next/image";
import { FaReply } from "react-icons/fa";
import { RiUserCommunityFill } from "react-icons/ri";
import { SlCalender, SlTag } from "react-icons/sl";

type Props = {

  Question: TblQuestion
  onAddAnswer: () => void;
};

function AnswerHelper(prop: Props) {

  const { NoOfReplies, CreatedOn, CreatedUser, QuestionTags, CommunityName } = prop.Question


  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-gray-100 rounded-lg shadow-sm p-6 sticky top-2.5">
      {/* Stats */}
      <div className="flex flex-wrap justify-between gap-y-4 mb-6">
        <div className="flex items-center gap-2">
          <FaReply className="w-4 h-4 text-gray-400" />
          <span className="text-[16px] text-gray-600 font-medium">
            {NoOfReplies ?? 0} Replies
          </span>
        </div>
        <PageBack />
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      <div className="mb-6">
        <p className="text-gray-800 text-md font-semibold mb-3">
          Want to contribute?
        </p>
        <button onClick={prop.onAddAnswer} className="bg-[#0073dc] text-white font-semibold rounded-lg py-2 px-5 mt-2">
          Add Answer
        </button>
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      {/* CREATED BY — unchanged as requested */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-3 font-semibold">CREATED BY</p>
        <div className="flex items-center gap-3">
          <Image
            width={24}
            height={24}
            src={
              CreatedUser?.[0]?.ProfileImageDocumentUrl || 'http://ui-avatars.com/api/?name=' + CreatedUser?.[0]?.FirstName + '+' + CreatedUser?.[0]?.LastName + '&background=random'
            }
            alt="User Icon"
            className="rounded-full"
          />
          <span className="text-sm text-gray-800 font-medium">
            {CreatedUser?.[0]?.FullName}
          </span>
        </div>
      </div>

      <div className="h-px bg-gray-300 mb-6" />

      {/* Info Details */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <RiUserCommunityFill className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Community</span>
          </div>
          <span className="text-blue-800 font-medium">{CommunityName}</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <SlTag className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Tags</span>
          </div>
          <span className="text-blue-800 font-medium">
            {QuestionTags?.map((m) => m.TagName).join(", ") || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <SlCalender className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Created</span>
          </div>
          <span className="text-gray-800 font-medium">{CreatedOn}</span>
        </div>

        {/* <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <CiClock1 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 font-medium">Last Activity</span>
          </div>
          <span className="text-gray-800 font-medium">Feb 10, 2025</span>
        </div> */}
      </div>
    </div>
  );
}

export default AnswerHelper;
