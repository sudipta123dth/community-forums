import { TBlCommunityTags } from "./TBlCommunityTags";

export default interface TblCommunity {
  CommunityId?: number;
  CommunityName?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
  FranchiseType?: string;
  FranchiseId?: number;
  CreatedOn?: string;
  CreatedBy?: string;
  CreatedIp?: string;
  ModifiedBy?: string;
  ModifiedOn?: string;
  ModifiedIp?: string;
  JoinedOn?: string;
  IsBlocked?: string;
  CommunityTags: TBlCommunityTags[]
}
