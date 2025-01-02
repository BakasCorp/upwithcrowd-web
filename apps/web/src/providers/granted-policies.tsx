"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import policies from "src/utils/page-policy/policies.json";
import type { Policy } from "src/utils/page-policy/utils";

const GrantedPoliciesContext = createContext<{
  grantedPolicies: Record<Policy, boolean>;
}>({ grantedPolicies: policies });

export const useGrantedPolicies = () => {
  return useContext(GrantedPoliciesContext);
};

export function GrantedPoliciesProvider({
  children,
  grantedPolicies = policies,
}: {
  children: ReactNode;
  grantedPolicies?: Record<string, boolean> | undefined;
}) {
  const key = useMemo(() => new Date().getTime().toString(), [grantedPolicies]);
  return (
    <GrantedPoliciesContext.Provider
      key={key}
      value={{ grantedPolicies: grantedPolicies as Record<Policy, boolean> }}
    >
      {children}
    </GrantedPoliciesContext.Provider>
  );
}
