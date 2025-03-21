import {getApiFileTypeGroupRulesetApi} from "@repo/actions/upwithcrowd/file-type-group/actions";
import {getFileApi} from "@repo/actions/upwithcrowd/file/action";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language/core/AccountService";
import DocumentsClient from "./client";

async function getApiRequests(id: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getApiFileTypeGroupRulesetApi({namespace: "ProjectRelatedFiles"}, session),
      getApiFileTypeGroupRulesetApi({namespace: "ProjectLegalSituation"}, session),
      getFileApi({
        relatedEntity: "Project",
        relatedId: id,
      }),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function ImagesPage({
  params,
  isDisable,
}: {
  params: {
    lang: string;
    id: string;
  };
  isDisable: boolean;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(params.id);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [projectRelatedFilesResponse, projectLegalSituationResponse, fileResponse] = apiRequests.requiredRequests;
  return (
    <DocumentsClient
      fileResponse={fileResponse.data}
      isDisable={isDisable}
      projectId={params.id}
      projectLegalSituation={projectLegalSituationResponse.data}
      projectRelatedFiles={projectRelatedFilesResponse.data}
    />
  );
}
