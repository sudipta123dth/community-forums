import { UploadApi } from '@/api';
import { toastNotify, useToken } from '@/helper';
import { TblAnswerAttachment, TblQuestionAttachment } from '@/interface/database';
import { Dispatch, SetStateAction } from 'react';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import UploadComp from './UploadComp';


interface Props {
    list: TblAnswerAttachment[] | TblQuestionAttachment[]
    setList: Dispatch<SetStateAction<TblAnswerAttachment[]>> | Dispatch<SetStateAction<TblQuestionAttachment[]>>
    className?: string;
}

export const isValidEntry = (file: TblAnswerAttachment | TblQuestionAttachment): boolean => {
    if (!file.AttachmentType) return false;
    if (file.AttachmentType === 'File' && !file.DocumentId) return false;
    if (file.AttachmentType === 'Url' && !file.ExternalUrl?.trim()) return false;
    return true;
};

const uploadApi = new UploadApi()

const AttachmentInput = ({ list, setList, className }: Props) => {
    const { jwtToken } = useToken()

    const addNewFile = () => {
        const last = list[list.length - 1];
        if (!!last) {
            if (!isValidEntry(last)) {
                toastNotify('Please complete the last entry before adding a new one.', 'warning')
                return;
            }
            setList([...list, { AttachmentType: 'Url' }])
        } else {
            setList([{ AttachmentType: 'Url' }])
        }
    };

    const updateFile = (index: number, updated: Partial<TblQuestionAttachment | TblAnswerAttachment>) => {
        const newList = list.map((f, i) => (i === index ? { ...f, ...updated } : f))
        setList(newList)
    };

    const removeFile = async (index: number) => {
        const newFiles = [...list];
        const deleted = newFiles.splice(index, 1);
        if (deleted[0].AttachmentType === 'File' && !!deleted[0].DocumentId) {
            await uploadApi.deleteFile(deleted[0].DocumentId?.toString(), jwtToken)
        }
        setList(newFiles)
    };


    return (
        <fieldset className={`px-4 pb-4 mb-4 border border-gray-300  ${className}`}>
            <legend className='p-2 uppercase text-sm font-bold text-slate-700'>Attachments</legend>
            <div className="flex justify-between items-center">
                <p className='text-sm'>Attachment count : {list.length}</p>
                <button
                    type='button' onClick={addNewFile}
                    className="btn btn-outline-primary cursor-pointer"
                >
                    <IoMdAdd />
                </button>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 ">
                {list.map((file, index) => (
                    <div
                        key={`attachment-${index}`}
                        className="bg-slate-50 dark:bg-slate-800 rounded shadow p-4 relative flex flex-col gap-3"
                    >
                        <div className="flex gap-2 text-sm font-medium">
                            {/* Upload File Tab */}
                            <label className={`cursor-pointer btn btn-sm ${file.AttachmentType === 'File' ? 'btn-info' : 'btn-outline-info'}`}
                            >
                                <input type="radio" name={`fileType-${index}`} value="Internal" checked={file.AttachmentType === 'File'} className="hidden"
                                    onChange={() =>
                                        updateFile(index, { AttachmentType: 'File', ExternalUrl: undefined })
                                    }
                                />
                                Upload File
                            </label>

                            {/* External URL Tab */}
                            <label className={`cursor-pointer btn btn-sm ${file.AttachmentType === 'Url' ? 'btn-info' : 'btn-outline-info'}`}
                            >
                                <input type="radio" name={`fileType-${index}`} value="External" checked={file.AttachmentType === 'Url'} className="hidden"
                                    onChange={() =>
                                        updateFile(index, { AttachmentType: 'Url', DocumentId: undefined, DocumentUrl: undefined })
                                    }
                                />
                                External URL
                            </label>
                        </div>

                        {file.AttachmentType === 'File' && (
                            <UploadComp
                                DocumentTitle='Answer-Attachment'
                                accept={uploadAccept}
                                inputClass=''
                                isMulti={false}
                                setDocumentId={() => { }}
                                onUploadComplete={(args) => updateFile(index, { DocumentId: Number(args.id), DocumentUrl: String(args.url) })}
                                documentId={file.DocumentId?.toString()}
                                previewUrl={file.DocumentUrl}
                            />
                        )}
                        {file.AttachmentType === 'Url' && (
                            <input type="url" required placeholder="Enter URL" value={file.ExternalUrl || ''} onChange={(e) => updateFile(index, { ExternalUrl: e.target.value })} className="form-input" />
                        )}
                        <button onClick={() => removeFile(index)} type='button' className="absolute top-2 right-0 text-red-600 cursor-pointer">
                            <IoMdClose />
                        </button>
                    </div>
                ))}
            </div>
        </fieldset>
    )
}

const uploadAccept = '.jpg,.jpeg,.png,application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'


export default AttachmentInput