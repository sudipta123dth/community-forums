"use client";
import ServerApi from "@/api/Server";
import CustomPagination from "@/components/common/CustomPagination";
import { apiErrorToast } from "@/helper/apiErrorToast";
import Pagination from "@/interface/common/Pagination";
import { TblAnswer, TblQuestion } from "@/interface/database";
import Image from "next/image";
import { Suspense, useState } from "react";
import DrawerComponent from "../../utils/Drawer";
import AnswerCard from "./AnswerCard";
import AnswerHelper from "./AnswerHelper";
import UpsertAnswer2 from "./UpsertAnswer2";

type Props = {
  question: TblQuestion;
  answerList: TblAnswer[];
  pagination: Pagination;
  userId?: string;
};

const answerApi = new ServerApi({ spName: "spCommunityForumAnonymous", mode: 7 });
const questionApi = new ServerApi({ spName: "spCommunityForumAnonymous", mode: 6 });

function AnswerPage(prop: Props) {

  const { QuestionText, QuestionAttachment } = prop.question

  const [question, setQuestion] = useState<TblQuestion>(prop.question);
  const [answer, setAnswer] = useState<TblAnswer[]>(prop.answerList);
  const [pagination, setPagination] = useState<Pagination>(prop.pagination);

  const [selectedAnswer, setSelectedAnswer] = useState<TblAnswer | null>(null);


  async function fetchAnswers(PageSize: number, PageIndex: number) {
    const qusRes = await questionApi
      .request({
        CommunityUserId: prop.userId,
        CommunityId: question.CommunityId,
        CQId: question.CQId,
      })
    if (qusRes.isSuccess) {
      const json = qusRes.isSuccess ? JSON.parse(qusRes.result)[0] : {};
      setQuestion(json)
    }

    const res = await answerApi.request({
      CommunityUserId: prop.userId,
      CQId: prop.question.CQId,
      PageSize,
      PageIndex,
    });

    if (res.isSuccess) {
      const ansJson = JSON.parse(res.result);
      if (!!ansJson.length) {
        setAnswer(ansJson[0]?.Answers || []);
        const page: Pagination = JSON.parse(ansJson[0]?.PaginationData);
        setPagination({
          PageIndex: page.PageIndex ?? 1,
          NoOfPages: page.NoOfPages ?? 1,
          PageSize: page.PageSize ?? 5,
        });
      }
    } else {
      apiErrorToast(res)
    }
  }



  return (
    <>
      <div className="w-full flex justify-center flex-col items-center px-4 py-10 ">

        <div className="mx-auto md:flex w-full md:w-2/3  gap-8">
          <div className="w-full md:w-2/3 px-6 py-8 space-y-8">

            {/* question */}
            <div className=" space-y-4 bg-gray-100 p-4 shadow rounded-md">
              <h1 className="text-2xl font-semibold text-slate-800 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: String(QuestionText) }} />

              {!!QuestionAttachment?.length && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Attachments:</p>
                  <ul className="list-disc list-inside text-blue-600 space-y-1 text-sm">
                    {QuestionAttachment.map((m, index) => (
                      <li key={`qus_attachment-${m.AttachmentId}`}>
                        <a
                          href={m.DocumentUrl ?? m.ExternalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-xs"
                        >
                          Attachment {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}


              {/* <div className="flex gap-4 flex-wrap">
                {QuestionTags?.map((t) => <p key={`tag-${t.TagId}`} className="bg-purple-300 px-4 py-1 rounded-full border-2 border-purple-500 text-purple-800 font-bold text-sm">{t.TagName}</p>)}
              </div> */}
              {/* <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Image
                    width={36}
                    height={36}
                    src={
                      CreatedUser?.[0].ProfileImageDocumentUrl || 'http://ui-avatars.com/api/?name=' + CreatedUser?.[0].FirstName + '+' + CreatedUser?.[0].LastName + '&background=random'
                    }
                    alt="User Icon"
                    className="rounded-full object-cover ring-1 ring-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    {CreatedUser?.[0].FullName}
                  </span>
                </div>
                <span className="text-md text-gray-500">
                  {CreatedOn}
                </span>
              </div> */}
            </div>

            <hr className="" />
            <div className="space-y-4">
              {answer.length > 0 ?
                <Suspense fallback={
                  <Image
                    height={100}
                    width={100}
                    src='/static/Rolling@1x-0.4s-200px-200px.svg'
                    alt="animation"
                  />
                }>
                  {answer.map((a) => (
                    <AnswerCard
                      key={`ans-${a.AnswerId}`}
                      answer={a}
                      userId={String(prop.userId)}
                      refetch={() => fetchAnswers(pagination.PageSize ?? 5, pagination.PageIndex ?? 1)}
                      onAnswerSelect={() => setSelectedAnswer(a)}
                    />
                  ))}
                </Suspense> :
                <p>No answers yet.</p>}
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-6">
            <AnswerHelper
              Question={question}
              onAddAnswer={() => {
                setSelectedAnswer({
                  AnswerText: undefined,
                  AnswerAttachment: [],
                })
              }}
            />
          </div>
        </div>
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto max-w-xs">
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Choose a number:
            </label>
            <div className="relative">
              <select
                name="number"
                id="number"
                value={pagination.PageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  fetchAnswers(newSize, pagination.PageIndex ?? 1);
                }}
                className="w-full appearance-none border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                ▼
              </div>
            </div>
          </div>

          <CustomPagination
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pagination?.NoOfPages ?? 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => {
              fetchAnswers(
                pagination?.PageSize ?? 5,
                selected + 1
              )
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



      {selectedAnswer && (
        <DrawerComponent
          open={!!selectedAnswer}
          onClose={() => setSelectedAnswer(null)}
          title={selectedAnswer?.AnswerId ? "Update Answer" : "Create Answer"}
          size="lg"
          className="w-full! md:w-[80%]!"
        >
          {/* <UpsertAnswerForm
            selectedAnswer={selectedAnswer}
            refetch={() => fetchAnswers(pagination.PageSize ?? 5, pagination.PageIndex ?? 1)}
            onDrawerClose={() => setSelectedAnswer(null)}
          /> */}
          <UpsertAnswer2
            selectedAnswer={selectedAnswer}
            refetch={() => fetchAnswers(pagination.PageSize ?? 5, pagination.PageIndex ?? 1)}
            onDrawerClose={() => setSelectedAnswer(null)}
          />
        </DrawerComponent>
      )}
    </>
  );
}

export default AnswerPage;
