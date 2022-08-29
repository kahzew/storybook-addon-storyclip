# Storyclip

Storybook addon for clipping a story or a part of a story as an image.

1. Press the <kbd>c</kdb>, or click the Camera button to enable the addon.

2. Hover over any DOM element in the story canvas.

3. Storybook will highlight the elements as you hover so you know which element is being clipped.

4. Click the desired element.

5. Wait for the notification in the bottom right.

6. Paste the contents of your clipboard in whatever application you want your clipped story in.

![Demo](demo.gif)

## Usage

This addon requires Storybook 6.3 or later. It also uses [html2canvas](https://github.com/niklasvh/html2canvas).

```sh
npm i -D @storybook/storybook-addon-storyclip
```

Add `"@storybook/storybook-addon-storyclip"` to the addons array in your `.storybook/main.js`:

```js
module.exports = {
  addons: ['@storybook/storybook-addon-storyclip'],
};
```