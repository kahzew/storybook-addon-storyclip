import React from 'react';
import { addons, types } from "@storybook/addons";
import { ADDON_ID, EVENTS, PARAM_KEY, TOOL_IDS } from "../constants";
import { Tool } from "../Tool";

// Unique ID for SB notifications
let notificationId: number = 1;

// Register the addon
addons.register(ADDON_ID, (api) => {

    // Register the tool
    addons.add(TOOL_IDS.CLIP_STORY, {
        type: types.TOOL,
        title: "Storyclip",
        match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
        render: Tool,
        paramKey: PARAM_KEY
    });

    // Get the addons channel
    const channel = addons.getChannel();

    // Register the finish event
    channel.on(EVENTS.FINISH, (dataUri: string) => {

        let currentNotificationId: number = notificationId++;

        // Notify User
        api.addNotification({
            content: {
                headline: 'Storyclip Finished',
                subHeadline:
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <span>Check your clipbaord for the following image: </span>
                        <img src={dataUri} style={{ height: 'auto', width: '100px', marginInline: '8px' }}></img>
                    </div>
            },
            id: `${currentNotificationId}`,
            link: '',
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

        // Clear the notification after 5 seconds
        setTimeout(() => {
            api.clearNotification(`${currentNotificationId}`);
        }, 5000);
    });
});

