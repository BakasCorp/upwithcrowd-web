"use server";

import type {GetApiIdentityClaimTypesData} from "@ayasofyazilim/saas/IdentityService";
import {getClaimTypesApi} from "src/actions/core/IdentityService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/IdentityService";
import {isUnauthorized} from "src/utils/page-policy/page-policy";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import ClaimTypesTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiIdentityClaimTypesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.ClaimTypes"],
    lang,
  });

  const claimTypesResponse = await getClaimTypesApi(searchParams);
  if (isErrorOnRequest(claimTypesResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={claimTypesResponse.message} />;
  }

  return <ClaimTypesTable languageData={languageData} response={claimTypesResponse.data} />;
}
