"use client";
import type {PagedResultDto_ListFileTypeDto} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {DefaultResource} from "@/language-data/core/Default";
import {tableData} from "./file-type-table-data";

function FileTypeTable({
  locale,
  languageData,
  response,
}: {
  locale: string;
  languageData: DefaultResource;
  response: PagedResultDto_ListFileTypeDto;
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.fileType.columns(locale);
  const table = tableData.fileType.table(languageData, router, grantedPolicies, locale);
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default FileTypeTable;
