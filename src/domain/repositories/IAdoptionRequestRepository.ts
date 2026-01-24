import type {
  AdoptionRequest,
  AdoptionRequestDetail,
  AdoptionRequestDetails,
  AdoptionRequestDocuments,
  AdoptionRequestPriority,
  AdoptionRequestStatus,
  AdoptionRequestSummary,
  UserAdoptionRequestSummary,
} from "@/domain/models/AdoptionRequest";

export interface CreateAdoptionRequestParams {
  animalId: number;
  foundationId: string;
  adopterUserId: string;
  details: AdoptionRequestDetails;
  documents: AdoptionRequestDocuments;
}

export interface GetAdoptionRequestsFilters {
  status?: AdoptionRequestStatus;
  priority?: AdoptionRequestPriority;
  search?: string;
}

export interface GetAdoptionRequestsPagination {
  page: number;
  pageSize: number;
}

export interface GetAdoptionRequestsParams {
  foundationId: string;
  filters?: GetAdoptionRequestsFilters;
  pagination: GetAdoptionRequestsPagination;
}

export interface GetAdoptionRequestsResult {
  requests: AdoptionRequestSummary[];
  total: number;
}

export interface GetUserAdoptionRequestsParams {
  adopterUserId: string;
}

export interface GetUserAdoptionRequestsResult {
  requests: UserAdoptionRequestSummary[];
}

export interface GetAdoptionRequestDetailParams {
  foundationId: string;
  requestId: number;
}

export interface GetAdoptionRequestAccessInfoParams {
  requestId: number;
}

export interface AdoptionRequestAccessInfo {
  requestId: number;
  foundationId: string;
  adopterUserId: string;
}

export interface GetAdoptionRequestsCountsParams {
  foundationId: string;
}

export interface AdoptionRequestsCounts {
  total: number;
  byStatus: {
    pending: number;
    in_review: number;
    info_requested: number;
    preapproved: number;
    approved: number;
    rejected: number;
    cancelled: number;
    completed: number;
  };
}

export interface UpdateAdoptionRequestStatusParams {
  foundationId: string;
  requestId: number;
  status: AdoptionRequestStatus;
  rejectionReason?: string | null;
  infoRequestMessage?: string | null;
  infoResponseMessage?: string | null;
}

export interface EnqueueInfoRequestEmailParams {
  requestId: number;
  adopterUserId: string;
  toEmail: string;
  subject: string;
  message: string;
  animalName: string;
  animalId: number;
  foundationId: string;
}

export interface AddResponseDocumentsParams {
  requestId: number;
  fileUrls: string[];
}

export interface NotifyFoundationMembersParams {
  foundationId: string;
  actorUserId: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown>;
}

export interface GetAdopterEmailByUserIdParams {
  adopterUserId: string;
}

export interface IAdoptionRequestRepository {
  createAdoptionRequest(params: CreateAdoptionRequestParams): Promise<AdoptionRequest>;
  getAdminRequests(params: GetAdoptionRequestsParams): Promise<GetAdoptionRequestsResult>;
  getUserRequests(params: GetUserAdoptionRequestsParams): Promise<GetUserAdoptionRequestsResult>;
  getRequestDetail(params: GetAdoptionRequestDetailParams): Promise<AdoptionRequestDetail>;
  getRequestAccessInfo(params: GetAdoptionRequestAccessInfoParams): Promise<AdoptionRequestAccessInfo>;
  getAdopterEmailByUserId(params: GetAdopterEmailByUserIdParams): Promise<string | null>;
  enqueueInfoRequestEmail(params: EnqueueInfoRequestEmailParams): Promise<void>;
  addResponseDocuments(params: AddResponseDocumentsParams): Promise<void>;
  notifyFoundationMembers(params: NotifyFoundationMembersParams): Promise<void>;
  updateStatus(params: UpdateAdoptionRequestStatusParams): Promise<void>;
}
