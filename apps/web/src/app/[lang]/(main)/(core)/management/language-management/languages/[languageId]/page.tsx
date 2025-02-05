"use server";

import {getLanguageDetailsByIdApi} from "src/actions/core/AdministrationService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/core/AdministrationService";
import {isUnauthorized} from "src/utils/page-policy/page-policy";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string; languageId: string}}) {
  const {lang, languageId} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["LanguageManagement.Languages.Edit"],
    lang,
  });
  const languageDetailsResponse = await getLanguageDetailsByIdApi(languageId);
  if (isErrorOnRequest(languageDetailsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={languageDetailsResponse.message} />;
  }
  return (
    <>
      <Form languageData={languageData} languageDetailsData={languageDetailsResponse.data} />
      <div className="hidden" id="page-title">
        {`${languageData.Language} (${languageDetailsResponse.data.displayName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Language.Update.Description"]}
      </div>
    </>
  );
}
