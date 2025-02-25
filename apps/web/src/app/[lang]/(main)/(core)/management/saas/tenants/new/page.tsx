"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAllEditionsApi} from "src/actions/core/SaasService/actions";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["Saas.Tenants.Create"],
    lang,
  });

  const editionsResponse = await getAllEditionsApi();
  if (isErrorOnRequest(editionsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={editionsResponse.message} />;
  }

  return (
    <>
      <Form editionList={editionsResponse.data} languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["Tenant.Create.Description"]}
      </div>
    </>
  );
}
