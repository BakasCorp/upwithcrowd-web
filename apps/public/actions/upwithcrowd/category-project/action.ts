"use server";

import type {GetApiCategoryData, GetApiTypeData} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {structuredResponse, structuredError} from "@repo/utils/api";
import {getUpwithcrowd} from "@/utils/client";

export async function getCategoryApi(data?: GetApiCategoryData) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.category.getApiCategory(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getTypeApi(data?: GetApiTypeData) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.type.getApiType(data);
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
