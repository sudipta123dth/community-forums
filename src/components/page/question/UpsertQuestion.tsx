'use client'

import { ServerApi } from "@/api"
import AttachmentInput from "@/components/common/AttachmentInput"
import { DrawerCompo, QuillEditor, QuillEditorRef } from "@/components/utils"
import { apiErrorToast, toastNotify, useToken } from "@/helper"
import { TBlCommunityTags, TblQuestion, TblQuestionAttachment } from "@/interface/database"
import { FormEvent, useRef, useState } from "react"


const UpsertQuestion = (props: Props) => {
    const { jwtToken, removeToken } = useToken()
    const { SelectedQuestion, CommunityTags } = props
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [quillContent, setQuillContent] = useState<string>(SelectedQuestion.QuestionText ?? '')
    const tagIds = SelectedQuestion?.QuestionTags?.map((t) => Number(t.TagId))
    const [selectedTags, setSelectedTags] = useState<number[]>(tagIds ?? [])

    const formRef = useRef<HTMLFormElement>(null);
    const quillRef = useRef<QuillEditorRef>(null);

    const [attachmentList, setAttachmentList] = useState<TblQuestionAttachment[]>([]);

    const upsetQusApi = new ServerApi({
        spName: 'spCommunityForumWebsite',
        mode: 5,
        withAuth: true,
        token: jwtToken
    });



    async function handelQusSave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (e.currentTarget) {

            const qus = quillContent

            if (!!qus?.toString().trim()) {
                setIsSubmitting(true)
                const payload = {
                    QuestionId: props.SelectedQuestion.QuestionId,
                    QuestionText: qus.toString().trim(),
                    CommunityId: props.CommunityId,
                    QuestionTags: selectedTags.join(','),
                    QuestionAttachment: attachmentList,
                }
                const res = await upsetQusApi.request(payload)
                if (res.statusCode === 401) {
                    removeToken()
                }
                if (res.isSuccess) {
                    props.refetch()
                    toastNotify(res.result)
                    setAttachmentList([])
                    setQuillContent('')
                    setSelectedTags([])
                    props.onClose()
                    formRef.current?.reset()
                } else {
                    apiErrorToast(res)
                }
                setIsSubmitting(false)
            } else {
                toastNotify('Please write a question', 'warning')
                return;
            }
        }
    }

    return (
        <DrawerCompo
            open={props.open}
            closeOnEsc={false}
            title="Add Question"
            onClose={props.onClose}
            size='lg'
        >
            <form onSubmit={handelQusSave} ref={formRef}>
                <div className="relative mb-4">
                    <label htmlFor="qus" className="leading-7 text-sm text-gray-600">Your Question</label>
                    <QuillEditor
                        ref={quillRef}
                        initialContent={quillContent}
                        onChange={(html) => setQuillContent(html)}
                        disabled={isSubmitting}
                    />
                </div>
                {!!CommunityTags.length &&
                    <div className="flex w-full gap-x-4 flex-wrap">
                        {CommunityTags.map((ct) => (
                            <button key={`ct-${ct.TagId}`} type="button" className={`${selectedTags.includes(Number(ct.TagId)) ? 'bg-blue-400 text-blue-50 border-blue-400' : 'border-blue-500 text-blue-500'} border  px-3 py-1 rounded cursor-pointer`}
                                onClick={() => {
                                    if (selectedTags.includes(Number(ct.TagId))) {
                                        setSelectedTags((prev) => prev.filter((p) => p !== Number(ct.TagId)))
                                    } else {
                                        setSelectedTags((p) => ([...p, Number(ct.TagId)]))
                                    }
                                }}
                            >
                                {ct.TagName}
                            </button>
                        ))}
                    </div>
                }
                <AttachmentInput list={attachmentList} setList={setAttachmentList} className="mt-4" />

                <button disabled={isSubmitting} type="submit" className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-6">Save</button>
            </form>
        </DrawerCompo>
    )
}



interface Props {
    SelectedQuestion: TblQuestion
    open: boolean
    CommunityId?: number
    refetch: () => void
    onClose: () => void
    CommunityTags: TBlCommunityTags[]
}

export default UpsertQuestion