"use client";
import dynamic from "next/dynamic";

import ServerApi from "@/api/Server";
import CustomPagination from "@/components/common/CustomPagination";
import { apiErrorToast } from "@/helper/apiErrorToast";
import Pagination from "@/interface/common/Pagination";
import { TblQuestion } from "@/interface/database";
import { QuestionTabType } from "@/interface/database/QuestionTabType";
import { TBlCommunityTags } from "@/interface/database/TBlCommunityTags";
import Image from "next/image";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { GoCommentDiscussion } from "react-icons/go";
import { MdOutlineSearch, MdOutlineTag, MdPerson } from "react-icons/md";
const QuestionList = dynamic(() => import("./QuestionList"), { ssr: false });
const QuestionTabFilter = dynamic(() => import('./QuestionTabFilter'), { ssr: false })


const questionApi = new ServerApi({
  spName: "spCommunityForumAnonymous",
  mode: 2,
});

export function QuestionPage(props: Props) {
  const { userId, communityId } = props;
  const [qusList, setQusList] = useState<TblQuestion[]>(props.QuestionList);
  const [pagination, setPagination] = useState<Pagination>(props.Pagination);
  const [appliedTag, setAppliedTag] = useState<TBlCommunityTags | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<QuestionTabType>("all");


  async function fetchQuestion(args: { PageSize: number, PageIndex: number, TagId?: number, tab?: QuestionTabType, search?: string }) {
    const tab = args.tab ?? activeTab
    const IsAnswered = tab === 'answered' ? true : tab === 'unanswered' ? false : undefined;
    const MostLiked = tab === 'mostliked'
    const MostAnswered = tab === 'mostanswered'
    const json = await questionApi.request({
      CommunityId: communityId,
      CommunityUserId: userId,
      PageSize: args.PageSize,
      PageIndex: args.PageIndex,
      IsAnswered,
      SortByMostLike: MostLiked,
      SortByMostAns: MostAnswered,
      ...(!!args.TagId && { TagId: args.TagId }),
      ...(!!args.search?.trim() && { QuestionText: args.search.trim() })
    })

    if (json.isSuccess) {
      const data = JSON.parse(json.result);
      const questions = data[0]?.Questions ?? [];
      const page: Pagination = JSON.parse(data[0].PaginationData);
      setQusList(questions)
      setPagination({
        PageIndex: page.PageIndex ?? 1,
        NoOfPages: page.NoOfPages ?? 1,
        PageSize: page.PageSize ?? 5,
      });
    } else {
      apiErrorToast(json)
    }

    setAppliedTag(props.CommunityTags?.find((t) => t.TagId === args.TagId))
  }

  const qusTabFilter = async (t: QuestionTabType) => {
    await fetchQuestion({ PageSize: 5, PageIndex: 1, TagId: undefined, tab: t })
    setActiveTab(t)
  }

  const handelQusSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget) {
      const formData = new FormData(e.currentTarget)
      await fetchQuestion({
        PageSize: pagination.PageSize ?? 5,
        PageIndex: pagination.PageIndex ?? 1,
        search: formData.get('qusSearch')?.toString()
      })
    }
  }


  return (
    <section className="w-full">
      <div className="w-full">
        <div className="relative w-full h-[300px]">
          {/* Fixed background image with overlay */}
          <div className="absolute inset-0 z-[-1]">
            <div
              className="w-full h-full bg-fixed bg-cover bg-bottom"
              style={{
                backgroundImage: "url('/31.jpg')",
              }}
            >
              <div className="w-full h-full bg-black/40" />
            </div>
          </div>

          {/* Foreground content */}
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="p-6 rounded-md flex flex-col gap-6">
              <h1 className="text-2xl font-sans font-bold text-white">
                Sharing Knowledge, Shaping Futures.
              </h1>
              <form className="w-full flex" onSubmit={handelQusSearch}>
                <input
                  type="text"
                  name="qusSearch"
                  id="qusSearch"
                  className="w-full px-4 py-2 rounded-l-md bg-white text-black placeholder-gray-600 focus:outline-none"
                  placeholder="Enter something..."
                />
                <button
                  type="submit"
                  className="bg-[#92e4ce] text-black font-bold px-4 py-2 rounded-r-md transition border-2 border-white cursor-pointer"
                >
                  <MdOutlineSearch />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2 justify-evenly w-full items-center font-semibold py-4 bg-slate-100">
          <div className="flex gap-2 justify-between items-center">
            <MdPerson />
            {props.UserData.Users ?? 0} person
          </div>
          <div className="flex gap-2 justify-between items-center">
            <CiCircleQuestion />
            {props.UserData.Questions ?? 0} questions
          </div>
          <div className="flex gap-2 justify-between items-center">
            <GoCommentDiscussion />
            {(props.UserData.Questions ?? 0) + (props.UserData.Answered ?? 0)} discussion
          </div>
          {!!appliedTag &&
            <div className="flex gap-x-2 items-center">
              <MdOutlineTag />
              {appliedTag?.TagName}
            </div>
          }
        </div>
      </div>


      <div className="flex flex-col justify-center items-start w-fit mx-auto gap-5 p-3 mt-3">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight font-sans ml-2">
          {props.communityName}
        </h1>
        <hr className="border-gray-700 w-full" />

        <QuestionTabFilter
          tab={activeTab}
          onTabChange={(t) => qusTabFilter(t)}
          communityId={props.communityId}
          refetch={async () =>
            await fetchQuestion({
              PageSize: pagination.PageSize ?? 5,
              PageIndex: pagination.PageIndex ?? 1
            })
          }
          CommunityTags={props.CommunityTags ?? []}
        />

        <div className="flex justify-start md:justify-evenly flex-col-reverse md:flex-row w-full gap-4">
          <Suspense
            fallback={
              <Image
                height={100}
                width={100}
                src='/static/Rolling@1x-0.4s-200px-200px.svg'
                alt="animation"
              />
            }
          >
            <div className="w-full flex flex-col gap-3">
              {!!qusList?.length ? (
                <QuestionList
                  data={qusList}
                  userId={userId!}
                  communityId={communityId!}
                  CommunityTags={props.CommunityTags ?? []}
                  refetch={async () =>
                    await fetchQuestion({
                      PageSize: pagination.PageSize ?? 5,
                      PageIndex: pagination.PageIndex ?? 1
                    })
                  }
                  tagIdRefetch={async (TagId) =>
                    await fetchQuestion({
                      PageSize: pagination.PageSize ?? 5,
                      PageIndex: 1,
                      TagId
                    })
                  }
                />
              ) : (
                <p>No question to show</p>
              )}
            </div>
          </Suspense>


          <CommunityTagGrid
            CommunityTags={props.CommunityTags ?? []}
            onClick={async (TagId) => {
              await fetchQuestion({
                PageSize: pagination.PageSize ?? 5,
                PageIndex: 1,
                TagId
              })
            }}
            onReset={async () => {
              await fetchQuestion({
                PageSize: pagination.PageSize ?? 5,
                PageIndex: pagination.PageIndex ?? 1
              })
            }}
          />
        </div>

        <div className="w-full bg-slate-50 rounded shadow p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="space-y-2">
            <select
              name="number"
              id="number"
              value={pagination?.PageSize ?? 5}
              onChange={(e) => {
                const newPageSize = Number(e.target.value);
                fetchQuestion({
                  PageSize: newPageSize,
                  PageIndex: pagination.PageIndex ?? 1
                })
              }}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>

            <p className="text-sm text-gray-600">
              Question per page: {pagination?.PageSize ?? 5}
            </p>
          </div>

          <CustomPagination
            previousLabel={"← Prev"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pagination?.NoOfPages ?? 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => {
              fetchQuestion({
                PageSize: pagination.PageSize ?? 5,
                PageIndex: selected + 1
              })
              // setPagination((prev) => ({ ...prev, PageIndex: selected + 1 }))
            }}
            forcePage={
              pagination?.PageIndex ? pagination?.PageIndex - 1 : 0
            }
            containerClassName={
              "flex gap-2 flex-wrap md:justify-end mt-2 md:mt-0"
            }
            activeClassName={"bg-blue-500 text-white"}
            pageClassName={"px-3 py-1 border rounded cursor-pointer"}
            previousClassName={"px-3 py-1 border rounded cursor-pointer"}
            nextClassName={"px-3 py-1 border rounded cursor-pointer"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </section>
  );
}

const colorClasses = [
  "border-rose-500 text-rose-500",
  "border-orange-500 text-orange-500",
  "border-yellow-600 text-yellow-400",
  "border-green-500 text-green-500",
  "border-cyan-500 text-cyan-500",
  "border-blue-500 text-blue-500",
  "border-violet-500 text-violet-500",
] as const;

function CommunityTagGrid({
  CommunityTags,
  onClick,
  onReset
}: {
  CommunityTags: TBlCommunityTags[];
  onClick: (TagId: number) => void;
  onReset: () => void
}) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const generated = CommunityTags.map(
      () => colorClasses[Math.floor(Math.random() * colorClasses.length)]
    );
    setColors(generated);
  }, [CommunityTags]);

  return (
    <div className="relative md:sticky h-fit flex flex-wrap flex-col gap-4 shadow bg-slate-50 p-4 rounded top-0 md:top-4">
      <div className="flex items-center gap-x-2 text-slate-800"><MdOutlineTag /> <span>Community Tags</span></div>
      <div className="">
        {CommunityTags.map((tag, index) => (
          <button
            key={`ct-${tag.TagId}`}
            className={`${colors[index] || "bg-gray-300"} border m-1 p-1 rounded-md shadow-sm font-semibold text-sm cursor-pointer `}
            onClick={() => onClick(Number(tag.TagId))}
          >
            {tag.TagName}
          </button>
        ))}
      </div>
      <button onClick={onReset} className="text-white bg-pink-500 border-0 py-1 px-4 focus:outline-none hover:bg-pink-600 rounded cursor-pointer w-fit">Reset</button>
    </div>
  );
}

type Props = {
  userId?: string;
  communityId?: number;
  communityName: string;
  CommunityTags?: TBlCommunityTags[];
  QuestionList: TblQuestion[],
  Pagination: Pagination;
  UserData: UsersCount
};

interface UsersCount {
  Users?: number,
  Questions?: number,
  Answered?: number
}



export default QuestionPage;
