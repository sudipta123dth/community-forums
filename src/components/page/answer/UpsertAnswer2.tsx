'use client'

import { ServerApi } from '@/api';
import { AttachmentInput } from '@/components/common';
import { QuillEditor, QuillEditorRef } from '@/components/utils';
import { apiErrorToast, toastNotify, useToken } from '@/helper';
import { TblAnswer, TblAnswerAttachment } from '@/interface/database';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';


const UpsertAnswer2 = (props: Props) => {
    const param = useParams();
    const { jwtToken, removeToken } = useToken();

    const { selectedAnswer } = props

    const quillRef = useRef<QuillEditorRef>(null);
    const [quillText, setQuillText] = useState<string>(selectedAnswer.AnswerText ?? "");

    const [attachmentList, setAttachmentList] = useState<TblAnswerAttachment[]>(selectedAnswer.AnswerAttachment ?? []);

    const upsertAnsApi = new ServerApi({
        spName: "spCommunityForumWebsite",
        mode: 2,
        withAuth: true,
        token: jwtToken
    });

    async function handleSubmit() {
        if (!quillText.trim()) {
            toastNotify("Please enter answer text");
            return;
        }

        const payload = {
            CQId: Number(param.CQId),
            CommunityUserId: String(param.userId),
            AnswerText: quillText.trim(),
            AnswerAttachment: attachmentList,
            AnswerId: !!selectedAnswer.AnswerId
                ? selectedAnswer.AnswerId
                : undefined,
        };

        try {
            const response = await upsertAnsApi.request(payload);
            if (response.statusCode === 401) {
                removeToken()
            }
            if (response.isSuccess) {
                props.refetch();
                toastNotify(response.result);
                props.onDrawerClose();
            } else {
                apiErrorToast(response);
            }
        } catch (error) {
            console.error("Submit error:", error);
            toastNotify("An error occurred while submitting");
        }
    }


    return (
        <div className='w-full space-y-6'>
            <QuillEditor
                ref={quillRef}
                initialContent={quillText}
                onChange={(html) => { setQuillText(html) }}
            />
            <AttachmentInput list={attachmentList} setList={setAttachmentList} />
            <button
                onClick={handleSubmit}
                className="btn btn-secondary"
            >
                Submit
            </button>
        </div>
    )
}

interface Props {
    selectedAnswer: TblAnswer;
    refetch: () => void;
    onDrawerClose: () => void;
};


export default UpsertAnswer2