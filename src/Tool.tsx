import React, { useCallback, useEffect } from "react";
import { useGlobals, useStorybookApi } from "@storybook/api";
import { Icons, IconButton } from "@storybook/components";
import { TOOL_ID, ADDON_ID, EVENTS } from "./constants";
import { addons } from "@storybook/addons";

export const Tool = () => {
    const [globals, updateGlobals] = useGlobals();
    const { storyclipEnabled } = globals;
    const api = useStorybookApi();
    const channel = addons.getChannel();

    let uid: number = 0;

    const toggleStoryclip = useCallback(
        () => {
            updateGlobals({
                storyclipEnabled: !storyclipEnabled
            })
        },
        [updateGlobals, storyclipEnabled, api]
    );


    const notifyStoryClipped = useCallback(
        () => {
            console.log('THE FUCK ' + uid);
            api.addNotification({
                content: {
                    headline: 'Storyclip Finished',
                    subHeadline: 'Check your clipboard for the generated image.'
                },
                id: `storybook-addon-storyclip-notification-${++uid}`,
                link: '#',
                icon: {
                    name: 'camera',
                    color: 'purple'
                }
            });
        }, [api, uid]
    );

    useEffect(() => {
        api.setAddonShortcut(ADDON_ID, {
            label: 'Toggle Storyclip [C]',
            defaultShortcut: ['C'],
            actionName: 'storyclip',
            showInMenu: false,
            action: toggleStoryclip,
        });
    }, [toggleStoryclip, api]);

    channel.on(EVENTS.CLIPPED, notifyStoryClipped);

    return (
        <IconButton
            key={TOOL_ID}
            active={storyclipEnabled}
            title="Toggle Storyclip"
            onClick={toggleStoryclip}>
            <Icons icon="camera" />
        </IconButton>
    );
};
