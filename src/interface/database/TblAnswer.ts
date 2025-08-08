import TblAnswerAttachment from "./TblAnswerAttachment";
import UserRegisterDTO from "./UserRegisterDTO";

export default interface TblAnswer {
  AnswerId?: number;
  CQId?: number;
  AnswerText?: string;
  IsPinned?: boolean;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedBy?: string;
  CreatedOn?: string;
  CreatedIp?: string;
  ModifiedBy?: string;
  ModifiedOn?: string;
  ModifiedIp?: string;
  AnswerAttachment?: TblAnswerAttachment[];
  IsDisLiked?: boolean;
  IsLiked?: boolean;
  LikeCount?: number;
  DisLikeCount?: number;
  CommunityUserId?: string;
  CreatedUser?: UserRegisterDTO[];
}
