interface Dimensions {
    height: number;
    width: number;
}

/**
 * Responsible for rendering an overlay
 * on top of an element with canvas.
 */
export class ElementOverlay {

    /**
     * The single canvas instance
     */
    private _canvas: HTMLCanvasElement;

    /**
     * The single canvas context
     */
    private _canvasContext: CanvasRenderingContext2D;

    /**
     * The canvas dimensions;
     */
    private _canvasDimensions: Dimensions;

    /**
     * The number of frames to render before stopping
     */
    private _animationFrameCount: number = 8;

    /**
     * The number of milliseconds to repeat the animation
     */
    private _animationIntervalTime: number = 30;

    /**
     * The overlay ending opacity
     */
    private _overlayEndingOpacity: number = 0.4;

    /**
     * The animation interval
     */
    private _currentInterval: NodeJS.Timeout;

    /**
     * Renders the overlay
     * @param element The element to render for
     */
    public startDraw(element: HTMLElement): void {
        // Stop the drawing if it's still running
        this.stopDraw();

        // Get the overlay values
        const elementBoundingClientRect = element.getBoundingClientRect();
        const elementWidth = elementBoundingClientRect.width;
        const elementHeight = elementBoundingClientRect.height;
        const elementTop = elementBoundingClientRect.top + window.scrollY;
        const elementLeft = elementBoundingClientRect.left + window.scrollX;
        let frameCounter = 1;

        // Start the interval
        this._currentInterval = setInterval(() => {
            // Create the background color
            let frameAlpha: number = (this._overlayEndingOpacity * ((frameCounter / this._animationFrameCount))) + 0.2;
            let frameColor: string = `hsla(360, 51%, 49%, ${frameAlpha})`;

            // Increment our frame counter
            frameCounter += 1;
            if (frameCounter === this._animationFrameCount) {
                clearInterval(this._currentInterval);
            }

            // Clear the canvas and save the state
            this.clear();
            this._canvasContext.save();

            // Draw the current canvas frame
            this._canvasContext.fillStyle = frameColor;
            this._canvasContext.fillRect(elementLeft, elementTop, elementWidth, elementHeight);

            // Restore canvas state
            this._canvasContext.restore();

        }, this._animationIntervalTime);
    }

    public stopDraw(): void {
        if (this._currentInterval) {
            clearInterval(this._currentInterval);
        }
    }

    /**
     * Initializes the ElementOverlayRenderer
     * by creating the underlying canvas
     */
    public initialize(): void {
        if (!this._canvas) {
            this.setCanvas();
        }
    }

    /**
     * Destroys the underlying canvas
     */
    public destroy(): void {
        if (this._canvas) {
            this.stopDraw();
            this.clear();
            this._canvas.parentNode.removeChild(this._canvas);
            this._canvas = undefined;
            this._canvasContext = undefined;
            this._canvasDimensions = undefined;
        }
    }

    /**
     * Clears the current canvas state
     */
    public clear(): void {
        if (this._canvasContext) {
            this._canvasContext.clearRect(0, 0, this._canvasDimensions.width, this._canvasDimensions.height);
        }
    }

    /**
     * Rescales the canvas dimensions
     */
    public rescale(): void {
        // Zero out dimensions
        this.setCanvasDimensions({ height: 0, width: 0 });

        // Reset to scaled document dimensions
        this.setCanvasDimensions(this.getDocumentDimensions());
    }

    /**
     * Get's the current document's dimensions
     * @returns The document dimensions
     */
    private getDocumentDimensions(): Dimensions {
        const container = global.document.documentElement;

        return {
            height: Math.max(container.scrollHeight, container.offsetHeight),
            width: Math.max(container.scrollWidth, container.offsetWidth)
        }
    }

    /**
     * Sets the private canvas instance.
     */
    private setCanvas(): void {
        this._canvas = global.document.createElement('canvas');
        this._canvas.id = 'storybook-addon-storyclip-canvas';
        this._canvasContext = this._canvas.getContext('2d');

        // Set canvas dimensions
        this.setCanvasDimensions(this.getDocumentDimensions());

        // Position canvas
        this._canvas.style.position = 'absolute';
        this._canvas.style.left = '0';
        this._canvas.style.top = '0';
        this._canvas.style.zIndex = '2147483647';

        // Disable any user interactions
        this._canvas.style.pointerEvents = 'none';

        // Create the canvas
        global.document.body.appendChild(this._canvas);
    }

    /**
     * Sets the canvas dimensions
     * @param dimensions The dimensions to set
     */
    private setCanvasDimensions(dimensions: Dimensions) {
        this._canvasDimensions = dimensions;
        this._canvas.style.width = `${dimensions.width}px`;
        this._canvas.style.height = `${dimensions.height}px`;

        // Scale
        const scale = global.window.devicePixelRatio;
        this._canvas.width = Math.floor(dimensions.width * scale);
        this._canvas.height = Math.floor(dimensions.height * scale);

        // Normalize coordinate system to use css pixels.
        this._canvasContext.scale(scale, scale);
    }
}