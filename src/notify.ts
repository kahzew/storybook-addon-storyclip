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
     * Initializes an instance
     * of the Notify class
     */
    public constructor() { }

    /**
     * Starts the notification
     */
    public start(): void {
        this.stop();

        const notificationHTML: string = this.getNotificationHTML();
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

    private removeNotificationElement(): void {
        let notificationElement = document.getElementById(this._notificationId);

        if (notificationElement) {
            notificationElement.remove();
        }
    }

    private getNotificationHTML(): string {
        // just make some crap
        let notificationHTML: string = `
            <div id="${this._notificationId}" style="position: absolute; right: 14px; bottom: 14px; box-shadow: 2px 2px 8px -2px rgb(93 89 110 / 60%); display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding-inline: 10px; background-color: hsla(223, 24%, 15%, 0.95); border-radius: 5px; height: 60px; width: 250px; gap: 10px; font-family: 'Nunito Sans',-apple-system,'.SFNSText-Regular','San Francisco',BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif;">
                <span style="font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 3.85px; color: hsla(223, 90%, 85%, 1);">Storyclip finished</span>
                <span style="font-weight: bold; font-size: 13px; color: white;">Check your clipboard for the image!</span>
            </div>`;

        return notificationHTML;
    }
}