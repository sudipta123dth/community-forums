'use client'

import { QuestionTabType } from "@/interface/database/QuestionTabType";
import { TBlCommunityTags } from "@/interface/database/TBlCommunityTags";
import { useState } from "react";
import { BiAddToQueue, BiArrowToTop, BiCheckCircle, BiCheckDouble, BiHelpCircle } from "react-icons/bi";
import { SlLike } from "react-icons/sl";
import UpsertQuestion from "./UpsertQuestion";



export default function QuestionTabFilter(props: props) {

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    return (
        <>
            <div className="flex flex-wrap gap-x-3 gap-y-2 w-full">
                <button
                    className={`${tabClassList.common} ${props.tab === "all" ? tabClassList.active : tabClassList.inActive}`}
                    onClick={() => props.onTabChange('all')}
                >
                    <BiCheckDouble size={18} /> All
                </button>

                <button
                    className={`${tabClassList.common} ${props.tab === "answered" ? tabClassList.active : tabClassList.inActive}`}
                    onClick={() => props.onTabChange('answered')}
                >
                    <BiCheckCircle size={18} /> Answered
                </button>

                <button
                    className={`${tabClassList.common} ${props.tab === "unanswered" ? tabClassList.active : tabClassList.inActive}`}
                    onClick={() => props.onTabChange("unanswered")}
                >
                    <BiHelpCircle size={18} /> Unanswered
                </button>

                <button
                    className={`${tabClassList.common} ${props.tab === "mostliked" ? tabClassList.active : tabClassList.inActive}`}
                    onClick={() => props.onTabChange("mostliked")}
                >
                    <SlLike size={18} /> Most Liked
                </button>
                <button
                    className={`${tabClassList.common} ${props.tab === "mostanswered" ? tabClassList.active : tabClassList.inActive}`}
                    onClick={() => props.onTabChange("mostanswered")}
                >
                    <BiArrowToTop size={18} /> Most Answered
                </button>
                <div className="md:ml-auto">
                    <button onClick={() => setDrawerOpen(true)} className="flex items-center rounded-md bg-sky-500 hover:bg-sky-600 transition duration-300 cursor-pointer text-sky-50 px-4 py-1 gap-x-3">
                        <BiAddToQueue />
                        Ask Doubt
                    </button>
                </div>
            </div>
            <UpsertQuestion
                SelectedQuestion={{ QuestionText: '', QuestionTags: [], QuestionAttachment: [] }}
                CommunityId={props.communityId}
                CommunityTags={props.CommunityTags}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen} refetch={props.refetch}
            />
        </>
    )
}

const tabClassList = {
    common: 'px-4 py-2 flex items-center gap-x-1 rounded',
    active: 'border-indigo-600 bg-indigo-600 text-white shadow-sm',
    inActive: 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-400'
}

interface props {
    tab: QuestionTabType,
    onTabChange: (t: QuestionTabType) => void
    communityId?: number
    refetch: () => void
    CommunityTags: TBlCommunityTags[]
}