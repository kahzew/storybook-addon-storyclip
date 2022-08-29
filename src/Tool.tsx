import React, { useCallback, useEffect } from "react";
import { useGlobals, useStorybookApi } from "@storybook/api";
import { Icons, IconButton } from "@storybook/components";
import { TOOL_ID, ADDON_ID } from "./constants";

export const Tool = () => {
    const [globals, updateGlobals] = useGlobals();
    const { storyclipEnabled } = globals;
    const api = useStorybookApi();

    const toggleStoryclip = useCallback(
        () => {
            updateGlobals({
                storyclipEnabled: !storyclipEnabled
            })
        },
        [updateGlobals, storyclipEnabled, api]
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
        <IconButton
            key={TOOL_ID}
            active={storyclipEnabled}
            title="Toggle Storyclip"
            onClick={toggleStoryclip}>
            <Icons icon="camera" />
        </IconButton>
    );
};
