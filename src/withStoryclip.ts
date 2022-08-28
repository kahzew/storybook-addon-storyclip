/* eslint-env browser */
import type { AnyFramework, PartialStoryFn as StoryFunction, StoryContext } from '@storybook/csf';
import { useEffect, addons, useChannel } from '@storybook/addons';
import { ElementClip } from './elementClip';
import { ElementOverlay } from './elementOverlay';
import { EVENTS } from './constants';
import { Notify } from './notify';

export const withStoryclip = (
    StoryFn: StoryFunction<AnyFramework>,
    context: StoryContext<AnyFramework>
) => {

    /**
     * Channel for communicating with manager
     */
    const channel = addons.getChannel();

    /**
     * Storyclip enabled
     */
    const { storyclipEnabled } = context.globals;

    /**
     * ElementClipper reference
     */
    const elementClipper: ElementClip = new ElementClip();

    /**
     * Element Overlay Renderer
     */
    const elementOverlay: ElementOverlay = new ElementOverlay();

    /**
     * Notify
     */
    const notify: Notify = new Notify();

    /**
     * Event bindings for click
     */
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            window.requestAnimationFrame(() => {
                event.stopPropagation();
                if (storyclipEnabled) {
                    elementClipper.create(event.target as HTMLElement, () => {
                        notify.start();
                    });
                }
            });
        };

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
            notify.stop();
        };
    }, [storyclipEnabled, elementClipper, channel, EVENTS, notify]);

    /**
     * Event Binding for mouse over
     */
    useEffect(() => {
        const onMouseOver = (event: MouseEvent) => {
            window.requestAnimationFrame(() => {
                event.stopPropagation();
                elementOverlay.startDraw(event.target as HTMLElement);
            });
        };

        const onResize = () => {
            window.requestAnimationFrame(() => {
                elementOverlay.rescale();
            });
        };

        if (storyclipEnabled) {
            elementOverlay.initialize();
            document.addEventListener('mouseover', onMouseOver);
            window.addEventListener('resize', onResize);
        }

        return () => {
            document.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('resize', onResize);
            elementOverlay.destroy();
        };
    }, [storyclipEnabled, elementOverlay]);

    return StoryFn();
};