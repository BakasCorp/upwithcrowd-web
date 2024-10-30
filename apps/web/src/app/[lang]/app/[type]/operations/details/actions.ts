"use server";
import type {
  GetApiTagServiceTagByIdDetailResponse,
  GetApiTagServiceTagData,
  GetApiTagServiceTagResponse,
  GetApiTagServiceTagSummaryData,
  GetApiTagServiceTagSummaryResponse,
  UniRefund_TagService_Tags_CreateTagRequestDto,
} from "@ayasofyazilim/saas/TagService";
import type { ServerResponse } from "src/lib";
import { getTagServiceClient, structuredError } from "src/lib";
import { getTableData } from "../../../actions/api-requests";
import { FilterColumnResult } from "@repo/ayasofyazilim-ui/molecules/tables";

export async function getTags(
  data: GetApiTagServiceTagData = {},
): Promise<ServerResponse<GetApiTagServiceTagResponse>> {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTag(data);
    return {
      data: response,
      message: "Tags fetched succesfully",
      status: 200,
      type: "success",
    };
  } catch (error) {
    return structuredError(error);
  }
}

export async function createTag(
  requestBody: UniRefund_TagService_Tags_CreateTagRequestDto,
) {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.postApiTagServiceTag({ requestBody });
    return {
      type: "success",
      data: response,
      status: 200,
      message: "Tag created successfully",
    };
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTagById({
  id,
}: {
  id: string;
}): Promise<ServerResponse<GetApiTagServiceTagByIdDetailResponse>> {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagByIdDetail({
      id,
    });
    return {
      type: "success",
      data: response,
      status: 200,
      message: "Tag details fetched successfully",
    };
  } catch (error) {
    return structuredError(error);
  }
}

export async function getSummary(
  data: GetApiTagServiceTagSummaryData = {},
): Promise<ServerResponse<GetApiTagServiceTagSummaryResponse>> {
  try {
    const client = await getTagServiceClient();
    const response = await client.tag.getApiTagServiceTagSummary(data);
    return {
      data: response,
      message: "Summary fetched succesfully",
      status: 200,
      type: "success",
    };
  } catch (error) {
    return structuredError(error);
  }
}

export async function getMerchants(page:number, filter?:FilterColumnResult){
  const response = await getTableData("merchants", page, 10, filter);
  if (response.type === "success") {
    const data = response.data;
    return {
      type: "success",
      data: { items: data.items || [], totalCount: data.totalCount || 0 },
    };
  }
  return {
    type: "success",
    data: { items: [], totalCount: 0 },
  };
}