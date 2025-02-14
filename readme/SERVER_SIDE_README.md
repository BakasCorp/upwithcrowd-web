# Server side sayfa yapısı bu şekilde olmalı.

```tsx
"use server";

import {structuredError} from "@/lib";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {FileIcon, FileText, HandCoins, Plane, ReceiptText, Scale, Store} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import Link from "next/link";
import {getVatStatementHeadersByIdApi} from "src/actions/unirefund/FinanceService/actions";
import {getRefundDetailByIdApi} from "src/actions/unirefund/RefundService/actions";
import {getProductGroupsApi} from "src/actions/unirefund/SettingService/actions";
import {getTagByIdApi} from "src/actions/unirefund/TagService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/TagService";
import {getBaseLink} from "src/utils";
import {dateToString, getStatusColor} from "../../_components/utils";
import Invoices from "./_components/invoices";
import TagCardList, {TagCard} from "./_components/tag-card";
import TagStatusDiagram from "./_components/tag-status-diagram";

async function getApiRequests(tagId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getTagByIdApi({id: tagId}),
      getProductGroupsApi({maxResultCount: 1}, session),
    ]);
    const failureIndex = requiredRequests.findIndex((i) => i.type !== "success");
    if (failureIndex !== -1) {
      return {message: requiredRequests[failureIndex].message || "Unknown error occurred"};
    }
    const tagDetail = requiredRequests[0].data;
    const optionalRequests = await Promise.allSettled([
      getVatStatementHeadersByIdApi(tagDetail.vatStatementHeaderId),
      getRefundDetailByIdApi(tagDetail.refundId),
    ]);
    return {requiredRequests: requiredRequests, optionalRequests: optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({params}: {params: {tagId: string; lang: string}}) {
  const {tagId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(tagId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests, optionalRequests} = apiRequests;
  const [tagDetailResponse, productGroupsResponse] = requiredRequests;
  const [vatStatementResponse, refundDetailResponse] = optionalRequests;

  const isThereAProductGroup = (productGroupsResponse?.data?.items?.length || 0) === 0;
  const tagDetail = tagDetailResponse.data;
  const vatStatementHeader = vatStatementResponse.status === "fulfilled" ? vatStatementResponse.value.data : null;
  const refundDetail = refundDetailResponse.status === "fulfilled" ? refundDetailResponse.value.data : null;
  return <>test</>;
}
```
