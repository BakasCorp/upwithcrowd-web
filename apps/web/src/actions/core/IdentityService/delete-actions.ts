"use server";

import {
  getIdentityServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function deleteUserSessionsApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.sessions.deleteApiIdentitySessionsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteRoleByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.role.deleteApiIdentityRolesById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteUserByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.user.deleteApiIdentityUsersById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteUserSessionsByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.sessions.deleteApiIdentitySessionsById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteClaimTypeByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.claimType.deleteApiIdentityClaimTypesById(
      {
        id,
      },
    );
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteScopeByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse = await client.scopes.deleteApiOpeniddictScopes({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function deleteApplicationByIdApi(id: string) {
  try {
    const client = await getIdentityServiceClient();
    const dataResponse =
      await client.applications.deleteApiOpeniddictApplications({
        id,
      });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
