"use client";

import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putUsersByIdTwoFactorByEnabledApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

const $userTwoFactorSchema = {
  type: "object",
  properties: {
    twoFactorAuthenticationEnabled: {
      type: "boolean",
      optional: true,
    },
  },
};

export default function Form({
  languageData,
  response,
}: {
  languageData: IdentityServiceResource;
  response: boolean;
}) {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $userTwoFactorSchema,
    resources: languageData,
    name: "Form.User.TwoFactor",
    extend: {
      twoFactorAuthenticationEnabled: {
        "ui:widget": "switch",
      },
    },
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={loading}
      formData={{ twoFactorAuthenticationEnabled: response }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        if (!formData) return;
        void putUsersByIdTwoFactorByEnabledApi({
          id: userId || "",
          enabled: formData.twoFactorAuthenticationEnabled || false,
        })
          .then((res) => {
            handlePutResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$userTwoFactorSchema}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}
