'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosProgressEvent } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaUpload } from "react-icons/fa";

import UploadApi from '@/api/UploadApi';
import { apiErrorToast } from '@/helper/apiErrorToast';
import toastNotify from '@/helper/toastNotify';
import { useToken } from '@/helper/useToken';
import ApiResponse from '@/interface/common/ApiResponse';
import UploadProps from '@/interface/props/UploadProps';
import Image from 'next/image';

const uploadApi = new UploadApi()

const UploadComp: React.FC<UploadProps> = (props) => {
    const { jwtToken, removeToken } = useToken()

    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [fileMetadata, setFileMetadata] = useState<
        {
            name: string;
            size: number;
        }[]
    >([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const showPreview = props.showPreview ?? true
    const fixed_folderPath = props.folderPath ?? 'Community_Forum'

    useEffect(() => {
        if (props.previewUrl) {
            const urls: string[] = []
            if (Array.isArray(props.previewUrl)) {
                props.previewUrl.forEach((u) => {
                    if (isValidURL(u)) {
                        urls.push(u)
                    }
                })
            } else {
                if (isValidURL(props.previewUrl)) {
                    urls.push(props.previewUrl)
                }
            }
            // console.log(urls)
            setPreviewUrls(urls);
        }
        if (props.errorTxt) {
            setErrorText(props.errorTxt);
        }
        setProgress(0);
    }, [props.previewUrl, props.errorTxt]);

    // useEffect(() => {
    //     const fetchFileSizes = async () => {
    //         const sizes = await Promise.all(previewUrls.map((url) => uploadApi.getFileSize(url)));
    //         const updatedMetadata = sizes.map((size, index) => {
    //             if ('data' in size) {
    //                 return {
    //                     name: fileMetadata[index]?.name || 'File',
    //                     size: size.data || 0, // Set to 0 if size not found
    //                 };
    //             } else {
    //                 return {
    //                     name: fileMetadata[index]?.name || 'File',
    //                     size: 0, // Set to 0 if size not found
    //                 };
    //             }
    //         });
    //         setFileMetadata(updatedMetadata);
    //     };

    //     if (previewUrls.length > 0) {
    //         // fetchFileSizes();
    //     }
    // }, [previewUrls]);

    useEffect(() => {
        return () => {
            setFiles([]);
            setPreviewUrls([]);
            setFileMetadata([]);
            setErrorText('');
            setProgress(0);
        };
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        setFiles(selectedFiles);

        const metadata = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
        }));
        setFileMetadata(metadata);
    };

    const formatSize = (size: number) => {
        if (size >= 1024 * 1024 * 1024)
            return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
        if (size >= 1024) return (size / 1024).toFixed(2) + ' KB';
        return size + ' B';
    };

    const handleFileUpload = async () => {
        if (props.disabled) return;

        if (files.length === 0 && props.required) {
            setErrorText(`${props.labelName} is required.`);
            return;
        }

        setIsLoading(true);
        setErrorText('');
        setProgress(0);

        try {
            if (props.documentId) {
                const idsToDelete = Array.isArray(props.documentId)
                    ? props.documentId
                    : [props.documentId];
                for (const docId of idsToDelete) {
                    if (docId !== '0') {
                        const deleteResponse: ApiResponse = await uploadApi.deleteFile(docId, jwtToken);
                        if (deleteResponse.statusCode == 401) {
                            removeToken()
                        }
                        if (deleteResponse.error?.data) {
                            toastNotify(
                                deleteResponse.error.data.errorMessages.join('<br />'),
                                'error'
                            );
                            setIsLoading(false);
                            return;
                        }
                    }
                }
                props.setDocumentId([]);
                setPreviewUrls([]);
            }

            const IsEncrypt = props?.IsEncrypt ? String(props?.IsEncrypt) : 'false';
            const folderPath = Array.isArray(fixed_folderPath)
                ? fixed_folderPath
                : Array.from(
                    { length: files.length },
                    (_, i) => `${fixed_folderPath}_${i + 1}`
                );
            const DocumentTitle = Array.isArray(props.DocumentTitle)
                ? props.DocumentTitle
                : Array.from(
                    { length: files.length },
                    (_, i) => `${props.DocumentTitle}_${i + 1}`
                );
            const formData = new FormData();

            if (props.isMulti) {
                files.forEach((file, index) => {
                    formData.append(`multiFiles[${index}].FileDetails`, file);
                    formData.append(`multiFiles[${index}].folderPath`, validFolderPath(folderPath[index]) as string);
                    formData.append(
                        `multiFiles[${index}].DocumentTitle`,
                        DocumentTitle[index]
                    );
                    formData.append(`multiFiles[${index}].IsEncrypt`, IsEncrypt);
                });
                formData.append('key', props.key ?? '');
            } else {
                files.forEach((file) => {
                    formData.append('FileDetails', file);
                });
                formData.append('folderPath', validFolderPath(folderPath) as string);
                formData.append('DocumentTitle', props.DocumentTitle as string);
                formData.append('key', props.key ?? '');
                formData.append('IsEncrypt', IsEncrypt);
            }

            const uploadProgressCallback = (event: AxiosProgressEvent) => {
                if (event.total) {
                    const percentCompleted = Math.round(
                        (event.loaded * 100) / event.total
                    );
                    setProgress(percentCompleted);
                }
            };

            const response: ApiResponse = props.isMulti
                ? await uploadApi.multiUploadFile({
                    formData,
                    onUploadProgress: uploadProgressCallback,
                    token: jwtToken,
                })
                : await uploadApi.uploadFile({
                    formData,
                    onUploadProgress: uploadProgressCallback,
                    token: jwtToken
                });
            if (response.statusCode == 401) {
                removeToken()
            }

            if (response.error) {
                apiErrorToast(response);
            } else {
                const dId = JSON.parse(response?.result);
                const { DocumentId, returnPath } = dId;
                const newDocumentIds = props.isMulti
                    ? dId?.map((x: any) => x.DocumentId)
                    : DocumentId;
                const newReturnPaths = props.isMulti
                    ? dId?.map((x: any) => x.returnPath)
                    : returnPath;

                const _previewUrls = Array.isArray(newReturnPaths)
                    ? newReturnPaths
                    : [newReturnPaths];
                setPreviewUrls(_previewUrls);
                props.setDocumentId(newDocumentIds);
                if (props.setReturnedPath) {
                    props.setReturnedPath(newReturnPaths);
                }
                if (props.onUploadComplete) {
                    props.onUploadComplete({ id: newDocumentIds, url: newReturnPaths })
                }

                setFiles([]);
                toastNotify('Upload successfully');

                // Clear the input after successful upload
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset the input value
                }
            }
        } catch (error) {
            console.log(error);
            setErrorText('An error occurred during file upload.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (props.documentId) {
            setProgress(0);

            const idsToDelete = Array.isArray(props.documentId)
                ? props.documentId
                : [props.documentId];
            const docId = idsToDelete[index];
            const response: ApiResponse = await uploadApi.deleteFile(docId, jwtToken);
            if (response.statusCode === 401) {
                removeToken()
            }
            if (response.error?.data) {
                toastNotify(response.error?.data.errorMessages.join(' '), 'error');
            } else {
                toastNotify('Deleted successfully');
                props.setDocumentId(idsToDelete.filter((_, i) => i !== index));
                props.setReturnedPath?.(previewUrls.filter((_, i) => i !== index));
                setPreviewUrls(previewUrls.filter((_, i) => i !== index));
            }
        } else {
            toastNotify('No file to delete!', 'error');
        }
    };


    return (
        <div className="w-full space-y-4">
            {props.labelShow && (
                <label className={props.labelClass}>
                    {props.labelName}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="space-y-2">
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept={props.accept}
                        className={`block w-full text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:text-primary-light hover:file:bg-primary cursor-pointer border border-primary rounded px-3 py-1 ${props.inputClass}`}
                        onChange={handleFileInput}
                        multiple={props.isMulti}
                        disabled={props.disabled}
                        ref={fileInputRef}
                        required={props.required}
                    />

                    {!isLoading && (
                        <button title="Upload File"
                            onClick={handleFileUpload}
                            className="text-green-500 cursor-pointer">
                            <FaUpload />
                        </button>
                    )}
                </div>

                {/* File Previews */}
                {showPreview && previewUrls.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => {
                            const metadata = fileMetadata[index];
                            const sizeFormatted =
                                metadata?.size || metadata?.size !== 0
                                    ? formatSize(metadata?.size)
                                    : null;
                            const extension = getFileExtensionFromCloudUrl(url)

                            return (
                                <div
                                    key={index}
                                    className="relative p-2 border rounded-lg bg-gray-200 shadow-md text-xs"
                                >
                                    {/* Display either image preview or file link */}
                                    {extension && imgExtensions.includes(extension) ? (
                                        <Image
                                            width={40}
                                            height={80}
                                            src={url}
                                            alt="Preview"
                                            className={`block object-cover ${props.imgTagClass} w-full h-24`}
                                        />
                                    ) : (
                                        <a
                                            target="_blank"
                                            href={url}
                                            title="View File"
                                            className={`block ${props.aTagClass} text-blue-600 underline`}
                                            rel="noreferrer"
                                        >
                                            {props.DocumentTitle || 'View Document'}
                                        </a>
                                    )}

                                    <div className="mt-2 text-xs text-gray-600">
                                        <p>{metadata?.name || props.DocumentTitle}</p>
                                        {sizeFormatted && <p>{sizeFormatted}</p>}
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        title="Delete File"
                                        onClick={() => handleDelete(index)}
                                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {isLoading && progress > 0 && (
                    <div
                        className={`bg-primary h-4 rounded-full ${progress !== 100 && 'animated-progress'}`}
                        style={{
                            width: `${progress}%`,
                            backgroundImage:
                                'linear-gradient(45deg,hsla(0,0%,100%,.15) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.15) 0,hsla(0,0%,100%,.15) 75%,transparent 0,transparent)',
                            backgroundSize: '1rem 1rem',
                        }}
                    >
                        <div className="text-center text-white text-xs">{progress}%</div>
                    </div>
                )}
                {errorText && <span className="text-red-500">{errorText}</span>}
            </div>
        </div>
    );
};

function isValidURL(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// remove unnecessary / from path start 
function validFolderPath(path: string | string[]): string | string[] {
    if (Array.isArray(path)) {
        const newPath = path.map((p) => {
            if (p.startsWith('/')) {
                return p.slice(1)
            } else {
                return p
            }
        })
        return newPath
    } else {
        if (path.startsWith('/')) {
            return path.slice(1)
        } else {
            return path
        }
    }
}

function getFileExtensionFromCloudUrl(path: string): string | undefined {
    const fileName = path.split('/').pop()
    const extension = fileName?.split('.').pop()
    return extension;
}

const imgExtensions = ['jpg', 'jpeg', 'png', 'svg', 'webp']

export default UploadComp;

export { getFileExtensionFromCloudUrl, isValidURL };

