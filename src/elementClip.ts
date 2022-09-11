import html2canvas, { Options } from 'html2canvas';

/**
 * Responsible for 'clipping' an element, which
 * retrieves an image of the selected element and
 * copies it the clipboard 
 */
export class ElementClip {

    /**
     * Setting for html2Canvas background color, perhaps
     * make this a public setting later for configuration?
     */
    private _backgroundColor?: string = null;

    /**
     * Initializes a new instance of
     * the ElementClip class.
     */
    public constructor() { }

    /**
     * Creates a clip of the element and sends it to the
     * clipboard.
     * @param element The element to clip
     * @param callback The callback to invoke upon completion
     */
    public create(element: HTMLElement, callback: (dataUrl: string) => void): void {

        // in order to write to the clipboard
        // the document must be in a focused state
        this.focusDocument();

        // Create settings
        let html2canvasSettings: Partial<Options> = this.createHtml2CanvasSettings(element);

        // Use html2canvas with defined settings
        html2canvas(element, html2canvasSettings).then((canvas: HTMLCanvasElement) => {

            // Convert canvas to blob
            canvas.toBlob((blob) => {

                // Write blob to the clipboard
                const clipboardItems = [new ClipboardItem({ ['image/png']: blob })];

                // Begin writing to the clipboard
                navigator.clipboard.write(clipboardItems).then(() => {

                    // finished copying, hook into storybook api?
                    if (callback) {
                        callback(canvas.toDataURL());
                    }
                });
            });
        });
    }

    /**
     * In order for the clipboard to work in an iframe when
     * the toolbar is focused, we need to clear any activeElements
     */
    private focusDocument(): void {
        // Give the document focus
        window.focus();

        // Remove focus from any focused element
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }
    }

    /**
     * Creates html2CanvasSettings
     * @param element The element to create the settings for
     * @returns The html2CanvasSettings
     */
    private createHtml2CanvasSettings(element: HTMLElement): Partial<Options> {
        return {
            backgroundColor: this._backgroundColor,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }
}