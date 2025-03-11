import type {ProfileMenuProps} from "@repo/ui/theme/types";
import {BadgeCheck} from "lucide-react";
import type {AbpUiNavigationResource} from "src/language-data/core/AbpUiNavigation";

export function getProfileMenuFromDB(languageData: AbpUiNavigationResource) {
  const profileMenu: ProfileMenuProps = {
    info: {
      name: "",
      email: "",
      image: "",
    },
    menuTitle: languageData.Profile,
    menu: {
      account: [
        {
          name: languageData.MyAccount,
          href: "/account/personal-information",
          onClick: undefined,
          icon: <BadgeCheck className="mr-2 w-4" />,
        },
      ],
      primary: [
        // {
        //   href: "#",
        //   onClick: undefined,
        //   name: languageData.Management,
        //   icon: <Layers className="mr-2 h-5 w-5 text-gray-400" />,
        // },
      ],
      secondary: [],
    },
  };

  return profileMenu;
}
