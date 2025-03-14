"use server";
import {Novu} from "@novu/api";

import {TriggerEventRequestDto} from "@novu/api/models/components";

export type CoreWorkFlowIds = "workflow-1" | "workflow-2" | "workflow-3";
export type ProjectWorkFlowIds = "" | "";

export type TriggerNovuNotification<P> = {
  workflowId: CoreWorkFlowIds | ProjectWorkFlowIds;
  payload: P;
  to: TriggerEventRequestDto["to"];
};

const novu = new Novu({
  serverURL: process.env.NOVU_APP_URL,
  secretKey: process.env.NOVU_SECRET_KEY,
});
const tenant = process.env.TENANT_ID
  ? {
      identifier: process.env.TENANT_ID,
    }
  : null;

export async function triggerNovuNotification<P extends {[k: string]: any}>({
  workflowId,
  payload,
  to,
}: TriggerNovuNotification<P>) {
  try {
    const result = await novu.trigger({
      workflowId,
      payload,
      to,
      tenant: tenant || undefined,
    });
    return result;
  } catch (error) {
    return {
      result: {
        status: "error",
      },
    };
  }
}
