import { addons, types } from "@storybook/addons";
import { ADDON_ID, EVENTS, PARAM_KEY, TOOL_ID } from "../constants";
import { Tool } from "../Tool";
import { useGlobals } from '@storybook/api';

// For notifications
let notificationId: number = 1;

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

    const channel = addons.getChannel();
    channel.on(EVENTS.FINISH, (dataUri: string) => {
        // Notify User
        api.addNotification({
            content: {
                headline: 'Storyclip Finished',
                subHeadline: 'Paste the contents of your clipboard into your favorite application.',
            },
            id: `${notificationId++}`,
            link: dataUri,
            icon: {
                name: 'camera',
                color: 'red'
            },
            onClear: () => { }
        });
        // Update the global
        api.updateGlobals({
            storyclipEnabled: false
        });
    });
});

