import type {
  AdoptionRequestDetail,
  AdoptionRequestPriority,
  AdoptionRequestStatus,
  AdoptionRequestSummary,
} from "@/domain/models/AdoptionRequest";

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

export interface GetAdoptionRequestDetailParams {
  foundationId: string;
  requestId: number;
}

export interface UpdateAdoptionRequestStatusParams {
  foundationId: string;
  requestId: number;
  status: AdoptionRequestStatus;
  rejectionReason?: string | null;
}

export interface IAdoptionRequestRepository {
  getAdminRequests(params: GetAdoptionRequestsParams): Promise<GetAdoptionRequestsResult>;
  getRequestDetail(params: GetAdoptionRequestDetailParams): Promise<AdoptionRequestDetail>;
  updateStatus(params: UpdateAdoptionRequestStatusParams): Promise<void>;
}
