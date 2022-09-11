/* eslint-env browser */
import type { AnyFramework, PartialStoryFn as StoryFunction, StoryContext } from '@storybook/csf';
import { useEffect, addons } from '@storybook/addons';
import { ElementClip } from './elementClip';
import { ElementOverlay } from './elementOverlay';
import { EVENTS } from './constants';

export const withStoryclip = (
    StoryFn: StoryFunction<AnyFramework>,
    context: StoryContext<AnyFramework>
) => {

    /**
     * Get the api channel
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
     * Event bindings for click
     */
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            if (storyclipEnabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
                elementClipper.create(event.target as HTMLElement, (dataUri: string) => {
                    channel.emit(EVENTS.FINISH, dataUri);
                });
            }
        };

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
        };
    }, [storyclipEnabled, elementClipper]);

    /**
     * Event Binding for mouse over
     */
    useEffect(() => {
        const onMouseOver = (event: MouseEvent) => {
            window.requestAnimationFrame(() => {
                event.stopImmediatePropagation();
                elementOverlay.startDraw(event.target as HTMLElement);
            });
        };

        const onResize = () => {
            window.requestAnimationFrame(() => {
                elementOverlay.rescale();
            });
        };

        if (storyclipEnabled) {
            document.getElementById('root').style.cursor = 'pointer';
            elementOverlay.initialize();
            document.addEventListener('mouseover', onMouseOver);
            window.addEventListener('resize', onResize);
        }

        return () => {
            document.getElementById('root').style.cursor = null;
            document.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('resize', onResize);
            elementOverlay.destroy();
        };
    }, [storyclipEnabled, elementOverlay]);

    /**
     * Remove any other listeners for the storyclip
     * request event.
     */
    channel.removeAllListeners(EVENTS.REQUEST);

    /**
     * Listen to the request event for whole story clips.
     */
    channel.once(EVENTS.REQUEST, () => {
        let wholeStoryElement = document.getElementById('root').children[0] as HTMLElement;
        elementClipper.create(wholeStoryElement, (dataUri: string) => {
            channel.emit(EVENTS.FINISH, dataUri);
        });
    });

    return StoryFn();
};