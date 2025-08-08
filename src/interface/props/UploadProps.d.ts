export default interface UploadProps {
  required?: boolean;
  initialImageUrl?: string | string[];
  setDocumentId: (value: string | string[]) => void;
  setReturnedPath?: (value: string | string[]) => void;
  onUploadComplete?: (args: {
    id: string | string[];
    url: string | string[];
  }) => void;
  documentId?: string | string[];
  folderPath?: string | string[];
  DocumentTitle: string | string[];
  key?: string;
  inputClass: string;
  labelClass?: string;
  imgTagClass?: string;
  aTagClass?: string;
  deleteButtonClass?: string;
  accept: string | undefined;
  labelName?: string;
  labelShow?: boolean;
  IsEncrypt?: boolean;
  previewUrl?: string;
  errorTxt?: string;
  disabled?: boolean;
  isMulti?: boolean;
  showPreview?: boolean;
}
