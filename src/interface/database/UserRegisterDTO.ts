export default interface UserRegisterDTO {
  Id?: string;
  UserName?: string;
  FirstName?: string;
  LastName?: string;
  FullName?: string;
  Email?: string;
  Name?: string;
  PhoneNumberCountryId?: number;
  PhoneNumber?: string;
  WhatsAppNumberCountryId?: number;
  WhatsAppNumber?: string;
  roles?: string[];
  RoleName?: string;
  FranchiseName?: string;
  ProfileImageDocumentUrl?: string;
  ProfileImageDocumentId?: number;
}
