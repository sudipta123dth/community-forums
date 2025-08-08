export default interface TblAnswerAttachment {
  localId?: number;
  AttachmentId?: number;
  AnswerId?: number;
  AttachmentType?: "File" | "Url";
  DocumentId?: number;
  DocumentUrl?: string;
  ExternalUrl?: string;
  IsDeleted?: boolean;
  IsSaved?: boolean;
}
