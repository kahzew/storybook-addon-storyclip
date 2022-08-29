import { addons, types } from "@storybook/addons";
import { ADDON_ID, PARAM_KEY, TOOL_ID } from "../constants";
import { Tool } from "../Tool";

// Register the addon
addons.register(ADDON_ID, (api) => {
    // Register the tool
    addons.add(TOOL_ID, {
        type: types.TOOL,
        title: "Storyclip",
        match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
        render: Tool,
        paramKey: PARAM_KEY
    });
});

