# Reddit Comment Helper Chrome Extension

A Chrome extension that demonstrates shadow DOM interaction with Reddit's comment system using the `shadow-dom-selector` library.

## Features

- **Shadow DOM Navigation**: Uses `shadow-dom-selector` to traverse Reddit's complex shadow DOM structure
- **Automated Comment Interaction**: Targets Reddit's `faceplate-tracker` elements for comment box activation
- **Performance Optimized**: Efficient query system that won't freeze Reddit's interface
- **Manifest V3**: Built for modern Chrome extension architecture

## How It Works

1. **Extension Icon Click**: Triggers background script communication to active Reddit tab
2. **Shadow DOM Detection**: Finds Reddit's comment button using `faceplate-tracker[noun="add_comment_button"]`
3. **Comment Box Activation**: Clicks the element to expand the comment input area
4. **Text Input Interaction**: Locates and focuses the expanded text input field
5. **Sample Text Insertion**: Types "This is a sample comment" with proper event handling

## Technical Stack

- **Manifest V3**: Latest Chrome extension format
- **Shadow DOM Selector**: Library for traversing shadow DOM trees
- **Webpack**: Build system with Babel transpilation
- **pnpm**: Package management and script execution

## Project Structure

```
src/
├── manifest.json          # Chrome extension manifest
├── background.js          # Extension background script
└── content-script.js      # Main Reddit interaction logic

dist/                      # Built extension files
├── background.js
├── content-script.js
├── manifest.json
└── icon*.png             # Extension icons

create-icons.py           # PNG icon generation utility
webpack.config.js         # Build configuration
package.json              # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Modern Chrome browser

### Installation & Build

1. **Clone the repository**:
   ```bash
   git clone https://github.com/knamnguyen/karmakit-shadowdom-test.git
   cd karmakit-shadowdom-test
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the extension**:
   ```bash
   pnpm build
   ```

4. **Load in Chrome**:
   - Open Chrome → Extensions → Developer mode ON
   - Click "Load unpacked" → Select the `dist/` folder
   - Extension appears in toolbar with proper icons

### Testing

1. **Navigate to Reddit**: Go to any Reddit post with comments
2. **Click Extension**: Click the Reddit Comment Helper icon
3. **Observer Console**: Check browser console for detailed interaction logs
4. **Verify Functionality**: Extension should interact with comment box

## Key Technical Features

### Shadow DOM Handling

The extension uses the `shadow-dom-selector` library to efficiently traverse Reddit's shadow DOM:

```javascript
// Find comment button across shadow boundaries
const commentButton = await asyncDeepQuerySelector('faceplate-tracker[noun="add_comment_button"]', {
  retries: 5,
  delay: 1000
});
```

### Performance Safeguards

- **Reduced Retry Counts**: Minimizes load on webpage
- **Timeout Protection**: Prevents infinite searches
- **Fallback Mechanisms**: Manual DOM search if shadow queries fail
- **Non-blocking Error Handling**: Continues execution on failures

### Event Handling

Comprehensive event dispatching for realistic user interactions:

```javascript
// Multiple click methods for robust activation
commentButton.focus();
commentButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
commentButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
commentButton.click();
```

## Development

### Scripts

- `pnpm build`: Create production build with PNG icons
- `pnpm dev`: Start development with watch mode
- `pnpm clean`: Remove dist directory

### Icon Management

Icons are automatically generated using Python PNG creation scripts. Make sure Python 3 is available for builds.

## Browser Compatibility

- **Chrome**: Manifest V3 support (Chrome 88+)
- **Edge**: Compatible with Chromium-based Edge
- **Testing**: Works on reddit.com desktop experience

## Limitations

- **Reddit-Specific**: Targets specific Reddit DOM structure
- **Desktop Only**: Optimized for desktop Reddit experience
- **Network Dependency**: Requires Reddit page to be loaded

## Contributing

This is a demonstration project showcasing shadow DOM interaction techniques. Feel free to:

1. Fork the repository
2. Create feature branches for enhancements
3. Submit pull requests for improvements
4. Share feedback or suggestions

## License

This project is for educational purposes demonstrating Chrome extension development and shadow DOM interaction techniques.

## Credits

- **shadow-dom-selector**: ElChiniNet for excellent shadow DOM traversal library
- **Reddit**: For providing a real-world shadow DOM testing environment
- **Chrome Extensions**: Modern Manifest V3 architecture patterns
