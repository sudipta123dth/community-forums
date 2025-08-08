export default interface TblQuestionAttachment {
  AttachmentId?: number;
  QuestionId?: number;
  AttachmentType?: "File" | "Url";
  DocumentId?: number;
  DocumentUrl?: string;
  ExternalUrl?: string;
  IsDeleted?: boolean;
}
