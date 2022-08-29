/**
 * Too lazy to figure out why
 * I couldn't get SB Notifications
 * to work
 */
export class Notify {

    /**
     * The HTML Notification ID
     */
    private _notificationId: string = 'storybook-addon-storyclip-notify';

    /**
     * The animation interval
     */
    private _currentTimeout: NodeJS.Timeout;

    /**
     * The timer value
     */
    private _timeoutValueMs: number = 2500;

    /**
     * Styles for the notify container
     */
    private _notifyElementStyles: any = {
        'border-radius': '4px',
        'background-color': 'rgba(50,53,71,0.97)',
        'display': 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        'justify-content': 'flex-start',
        'padding-inline': '10px',
        'position': 'fixed',
        'right': '14px',
        'bottom': '14px',
        'box-shadow': '2px 2px 8px -2px rgb(93 89 110 / 60%)',
        'min-height': '76px',
        'width': '250px',
        'gap': '14px',
        'font-family': `'Nunito Sans',-apple-system,'.SFNSText-Regular','San Francisco',BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif`
    };

    private _notifyTextContainerElementStyles: any = {
        'display': 'flex',
        'flex-direction': 'column',
        'align-items': 'flex-start',
        'justify-content': 'center',
    }

    /**
     * Styles for the notify header text
     */
    private _notifyHeaderTextElementStyles: any = {
        'font-weight': '700',
        'font-size': '12px',
        'color': 'white'
    }

    /**
     * Styles for the notify body text
     */
    private _notifyBodyTextElementStyles: any = {
        'margin-top': '2px',
        'font-size': '11px',
        'color': 'rgba(255,255,255,0.75)'
    }

    /**
     * Initializes an instance
     * of the Notify class
     */
    public constructor() { }

    /**
     * Starts the notification
     * @param blob The image blob from the clip
     */
    public start(dataUrl: string): void {
        this.stop();

        const notificationHTML: string = this.getNotificationHTML(dataUrl);
        const rootElement = document.getElementById('root');

        rootElement.insertAdjacentHTML('afterend', notificationHTML);

        this._currentTimeout = setTimeout(() => {
            this.removeNotificationElement();
        }, this._timeoutValueMs);
    }

    /**
     * Stops the notify
     */
    public stop(): void {
        if (this._currentTimeout) {
            this.removeNotificationElement();
            clearTimeout(this._currentTimeout);
        }
    }

    /**
     * Removes the notification element from
     * the story
     */
    private removeNotificationElement(): void {
        let notificationElement = document.getElementById(this._notificationId);

        if (notificationElement) {
            notificationElement.remove();
        }
    }

    /**
     * Gets the notify HTML string
     * to insert
     * @returns The HTML string
     */
    private getNotificationHTML(dataUrl: string): string {
        // just make some crap
        let notificationHTML: string = `
            <div id="${this._notificationId}" style="${this.getStyleString(this._notifyElementStyles)}">
                <div style="${this.getStyleString(this._notifyTextContainerElementStyles)}">
                    <span style="${this.getStyleString(this._notifyHeaderTextElementStyles)}">Storyclip finished</span>
                    <span style="${this.getStyleString(this._notifyBodyTextElementStyles)}"">Check your clipboard for the image!</span>
                </div>
                <img style="height: auto; width: 60px;" src="${dataUrl}" />
            </div>`;

        return notificationHTML;
    }

    /**
     * Gets the style value based on a json
     * object.
     * @param elementStyles The element style object
     * @returns The stringified element style
     */
    private getStyleString(elementStyles: any): string {
        return Object.entries(elementStyles).map(style => `${style[0]}: ${style[1]};`).join(" ");
    }
}