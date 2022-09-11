import React, { useCallback, useEffect } from "react";
import { useGlobals, useStorybookApi } from "@storybook/api";
import { Icons, IconButton } from "@storybook/components";
import { TOOL_IDS, ADDON_ID, EVENTS } from "./constants";
import { addons } from '@storybook/addons'

export const Tool = () => {
    const [globals, updateGlobals] = useGlobals();
    const { storyclipEnabled } = globals;
    const api = useStorybookApi();
    const channel = addons.getChannel();

    const toggleStoryclip = useCallback(
        () => {
            updateGlobals({
                storyclipEnabled: !storyclipEnabled
            })
        },
        [updateGlobals, storyclipEnabled, api]
    );

    const requestWholeStoryClip = useCallback(
        () => {
            channel.emit(EVENTS.REQUEST)
        },
        [channel]
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

    return (
        <React.Fragment>
            <IconButton
                key={TOOL_IDS.CLIP_STORY}
                active={storyclipEnabled}
                title="Toggle Storyclip"
                onClick={toggleStoryclip}>
                <Icons icon="location" />
            </IconButton>
            <IconButton
                key={TOOL_IDS.WHOLE_STORY}
                title="Clip Whole Story"
                onClick={requestWholeStoryClip}>
                <Icons icon="camera" />
            </IconButton>
        </React.Fragment>
    );
};
