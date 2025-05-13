//customIcons.ts
import { h } from "vue";
import type { IconSet, IconProps } from "vuetify";
import projectIcon from "./ProjectIcon.vue";
const customSvgNameToComponent: any = {
    projectIcon
};

export const customIcons: IconSet = {
  component: (props: IconProps) => h(customSvgNameToComponent[props.icon]),
};

