"use client";
import ServerApi from "@/api/Server";
import { apiErrorToast } from "@/helper/apiErrorToast";
import { useToken } from "@/helper/useToken";
import { TBlCommunityTags, TblQuestion } from "@/interface/database";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import { ImPushpin } from "react-icons/im";
import UpsertQuestion from "./UpsertQuestion";

type Props = {
  data: TblQuestion[];
  userId: string;
  communityId: number;
  refetch: () => void;
  tagIdRefetch: (TagId: number) => void;
  CommunityTags: TBlCommunityTags[]
};

function QuestionList(props: Props) {
  const { userId, communityId } = props;
  const { jwtToken, removeToken } = useToken()

  const [selectedQuestion, setSelectedQuestion] = useState<TblQuestion | null>(null)

  const likeDislikeApi = new ServerApi({
    spName: "spCommunityForumWebsite",
    mode: 1,
    withAuth: true,
    token: jwtToken
  });

  async function toggleLikeDislike(q: TblQuestion, type: "like" | "dislike") {
    const likeJson = await likeDislikeApi.request({
      CommunityUserId: userId,
      CQId: q.CQId,
      IsLiked:
        (q.IsLiked && type === "like") || type === "dislike" ? false : true,
      IsDisLiked:
        (q.IsDisLiked && type === "dislike") || type === "like" ? false : true,
    });

    if (likeJson.statusCode === 401) {
      removeToken()
    }
    if (likeJson.isSuccess) props.refetch();
    else apiErrorToast(likeJson);
  }

  return (
    <>
      {props.data.map((q) => (
        <div
          key={q.CQId}
          className="w-full max-w-[850px] p-6 bg-neutral-50 border border-neutral-200 rounded-2xl shadow transition hover:shadow-md font-sans space-y-5"
        >
          <div className="flex justify-between items-center">
            <Link
              href={`/answer/${userId}/${communityId}/${q.CQId}`}
              className="text-xl font-semibold text-indigo-700 hover:underline break-words leading-snug"
            >
              <p dangerouslySetInnerHTML={{ __html: String(q.QuestionText) }} />
            </Link>

            {!!q.IsPinned && (
              <div className="border-2 border-yellow-500 p-1 rounded bg-yellow-100">
                <ImPushpin className="text-yellow-900" />
              </div>
            )}
          </div>

          {!!q.AttachmentCount &&
            <div className="font-semibold border-cyan-500 border w-fit rounded-lg px-3 py-1 text-sm text-cyan-500 bg-cyan-100">
              {` + ${q.AttachmentCount} attachment`}
            </div>
          }

          <div className="flex flex-wrap flex-col items-start gap-y-2 text-sm text-neutral-600">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                width={32}
                height={32}
                src={
                  q?.CreatedUser?.[0]?.ProfileImageDocumentUrl ||
                  "https://ui-avatars.com/api/?name=User&background=random"
                }
                alt="User Icon"
                className="w-8 h-8 rounded-full object-cover border border-neutral-300"
              />
              <span className="font-medium truncate text-neutral-800">
                {q?.CreatedUser?.[0]?.FullName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500">Created:</span>
              <span className="text-neutral-700">{q?.CreatedOn}</span>
            </div>

            {!!q.LastReplied && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-neutral-500">Last Replied:</span>
                <span className="text-neutral-700">{q?.LastReplied}</span>
              </div>
            )}
          </div>



          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <Link href={`/answer/${userId}/${communityId}/${q.CQId}`}>
                <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition">
                  <FaReply className="w-5 h-5" />
                  <span className="font-medium">{q?.NoOfReplies} Replies</span>
                </button>
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleLikeDislike(q, "like")}
                  className="text-green-600 hover:text-green-800 transition"
                >
                  {q.IsLiked ? (
                    <BiSolidLike className="w-5 h-5" />
                  ) : (
                    <BiLike className="w-5 h-5" />
                  )}
                </button>
                <span className="text-neutral-700">{q.LikeCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleLikeDislike(q, "dislike")}
                  className="text-rose-500 hover:text-rose-700 transition"
                >
                  {q.IsDisLiked ? (
                    <BiSolidDislike className="w-5 h-5" />
                  ) : (
                    <BiDislike className="w-5 h-5" />
                  )}
                </button>
                <span className="text-neutral-700">{q.DisLikeCount}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {q.QuestionTags?.map((tag) => (
                <button
                  key={tag.TagId}
                  className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold border border-teal-300 hover:bg-teal-200 transition cursor-pointer"
                  onClick={() => props.tagIdRefetch(Number(tag.TagId))}
                >
                  {tag.TagName}
                </button>
              ))}
            </div>
          </div>

          {/* <button onClick={() => setSelectedQuestion(q)}>
            edit
          </button> */}
        </div>
      ))}
      {!!selectedQuestion &&
        <UpsertQuestion
          SelectedQuestion={selectedQuestion}
          CommunityId={props.communityId}
          CommunityTags={props.CommunityTags}
          onClose={() => setSelectedQuestion(null)}
          open={!!selectedQuestion} refetch={props.refetch}
        />
      }
    </>
  );
}

export default QuestionList;
