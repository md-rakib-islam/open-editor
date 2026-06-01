# TrendyMC - TextEditorByRakib

A modern, feature-rich rich text editor based on TinyMCE, rebranded and customized as TrendyMC.

## About

TrendyMC is a rebranded version of the TinyMCE rich text editor, designed to provide a powerful and flexible content editing experience. This project maintains the robust functionality of TinyMCE while offering a distinct branded identity suitable for custom deployments.

## Features

- **Rich Text Editing**: Full WYSIWYG editing capabilities
- **Extensive Plugin Support**: Including lists, links, images, tables, media, and more
- **Multiple Themes**: Silver theme with various UI skins
- **Content Skins**: Multiple content styling options (default, dark, document, writer)
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Accessibility**: Built with accessibility standards in mind
- **Customizable**: Extensive API for customization and extension

## Installation

### npm

Install TrendyMC via npm:

```bash
npm install trendymc
```

Or using yarn:

```bash
yarn add trendymc
```

### CDN

You can also use TrendyMC via jsDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/trendymc@latest/js/trendymc/trendymc.min.js"></script>
```

### Direct Download

Download the files directly and include them in your project:

```html
<script src="path/to/js/trendymc/trendymc.min.js"></script>
```

## Quick Start

### React Component (Recommended)

TrendyMC provides a React component that's **100% compatible with TinyMCE React API**.

#### Basic Example

```jsx
import React, { useState, useRef } from 'react';
import { Editor } from 'trendymc';

function App() {
  const [content, setContent] = useState('<p>Hello TrendyMC!</p>');
  const editorRef = useRef(null);

  const handleEditorChange = (newContent, editor) => {
    setContent(newContent);
    console.log('Content:', newContent);
  };

  return (
    <div>
      <h1>My Editor</h1>
      <Editor
        initialValue={content}
        onEditorChange={handleEditorChange}
        height={500}
        ref={editorRef}
      />
      <button onClick={() => console.log(editorRef.current.getContent())}>
        Get Content
      </button>
    </div>
  );
}

export default App;
```

#### TinyMCE-Compatible Syntax (Drop-in Replacement)

If you're migrating from `@tinymce/tinymce-react`, your code works as-is:

```jsx
import React, { useRef } from 'react';
import { Editor } from 'trendymc';

function MyForm() {
  const editorRef = useRef(null);

  const log = (content, editor) => {
    console.log('Content:', content);
  };

  return (
    <Editor
      value={field.value}
      onInit={(evt, editor) => (editorRef.current = editor)}
      placeholder="Enter your content here..."
      onEditorChange={log}
      id="my-editor"
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image',
          'charmap', 'preview', 'anchor', 'searchreplace',
          'visualblocks', 'code', 'fullscreen', 'insertdatetime',
          'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  );
}
```

#### Controlled Component Example

```jsx
import React, { useState } from 'react';
import { Editor } from 'trendymc';

function ControlledEditor() {
  const [content, setContent] = useState('<p>Initial content</p>');

  return (
    <div>
      <Editor
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
      />
      <button onClick={() => setContent('<p>Reset content</p>')}>
        Reset
      </button>
    </div>
  );
}
```

#### With Form Integration (React Hook Form, Formik, etc.)

```jsx
import React from 'react';
import { Editor } from 'trendymc';
import { Controller, useForm } from 'react-hook-form';

function FormWithEditor() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Editor
            value={field.value}
            onEditorChange={field.onChange}
            placeholder="Enter description..."
            init={{
              height: 400,
              menubar: false,
              plugins: 'lists link image',
              toolbar: 'undo redo | bold italic | bullist numlist'
            }}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## React Component API Reference

### Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique ID for the editor instance |
| `initialValue` | `string` | Initial content (uncontrolled mode) |
| `value` | `string` | Current content (controlled mode) |
| `onEditorChange` | `(content: string, editor: Editor) => void` | Callback when content changes (TinyMCE-style) |
| `onChange` | `(content: string, editor: Editor) => void` | Callback when content changes (alternative) |
| `onInit` | `(evt: Event, editor: Editor) => void` | Callback when editor initializes |
| `onBlur` | `(evt: Event, editor: Editor) => void` | Callback when editor loses focus |
| `onFocus` | `(evt: Event, editor: Editor) => void` | Callback when editor gains focus |
| `placeholder` | `string` | Placeholder text when editor is empty |
| `height` | `number` | Editor height in pixels (default: 500) |
| `inline` | `boolean` | Enable inline editing mode |
| `disabled` | `boolean` | Disable the editor (readonly mode) |
| `toolbar` | `string` | Toolbar configuration |
| `plugins` | `string[]` | Array of plugin names to enable |
| `init` | `object` | Additional TrendyMC configuration options |

### Ref Methods

Access these methods via `ref.current`:

| Method | Returns | Description |
|--------|---------|-------------|
| `getContent()` | `string` | Get current HTML content |
| `setContent(content)` | `void` | Set HTML content |
| `insertContent(content)` | `void` | Insert content at cursor position |
| `focus()` | `void` | Focus the editor |
| `getEditor()` | `Editor` | Get raw TrendyMC editor instance |

### Example with All Features

```jsx
import React, { useRef, useState } from 'react';
import { Editor } from 'trendymc';

function AdvancedEditor() {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleInit = (evt, editor) => {
    console.log('Editor initialized:', editor);
    editorRef.current = editor;
  };

  const handleChange = (newContent, editor) => {
    setContent(newContent);
    setWordCount(editor.plugins.wordcount.body.getWordCount());
  };

  const insertCustomContent = () => {
    editorRef.current.insertContent('<p><strong>Custom content inserted!</strong></p>');
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        Words: {wordCount}
      </div>

      <Editor
        id="advanced-editor"
        value={content}
        onInit={handleInit}
        onEditorChange={handleChange}
        placeholder="Start typing..."
        height={600}
        disabled={false}
        plugins={[
          'advlist', 'autolink', 'lists', 'link', 'image',
          'charmap', 'preview', 'anchor', 'searchreplace',
          'visualblocks', 'code', 'fullscreen', 'insertdatetime',
          'media', 'table', 'help', 'wordcount'
        ]}
        toolbar="undo redo | formatselect | bold italic backcolor |
                alignleft aligncenter alignright alignjustify |
                bullist numlist outdent indent | removeformat | help"
        init={{
          menubar: true,
          statusbar: true,
          branding: false,
          content_style: 'body { font-family: Arial, sans-serif; font-size: 14px }'
        }}
        ref={editorRef}
      />

      <button onClick={insertCustomContent}>
        Insert Custom Content
      </button>
    </div>
  );
}
```

## Migrating from TinyMCE React

**No changes needed!** TrendyMC's React component is API-compatible with `@tinymce/tinymce-react`.

Just replace the import:

```jsx
// Before
import { Editor } from '@tinymce/tinymce-react';

// After
import { Editor } from 'trendymc';

// Everything else stays the same!
```

### Using with npm/ES6 Modules

```javascript
// Import TrendyMC
import 'trendymc';

// Initialize editor
trendymc.init({
    selector: '#editor',
    license_key: 'gpl',
    plugins: 'lists link image',
    toolbar: 'undo redo | bold italic'
});
```

### Using with Node.js/CommonJS

```javascript
// Require TrendyMC
require('trendymc');

// Initialize editor
trendymc.init({
    selector: '#editor',
    license_key: 'gpl',
    plugins: 'lists link image',
    toolbar: 'undo redo | bold italic'
});
```

### Basic HTML Usage

Include TrendyMC in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrendyMC Editor</title>
    <script src="js/trendymc/trendymc.min.js"></script>
</head>
<body>
    <textarea id="editor">
        <p>Start editing with TrendyMC!</p>
    </textarea>

    <script>
        trendymc.init({
            selector: '#editor',
            license_key: 'gpl',
            plugins: 'lists link image table code help wordcount',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code'
        });
    </script>
</body>
</html>
```

### Configuration Options

TrendyMC supports extensive configuration options:

```javascript
trendymc.init({
    selector: '#editor',
    license_key: 'gpl',

    // Plugins
    plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],

    // Toolbar
    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',

    // Content styling
    content_css: 'js/trendymc/skins/content/default/content.min.css',

    // UI skin
    skin: 'oxide',

    // Height
    height: 500,

    // Additional options
    menubar: true,
    statusbar: true,
    branding: false
});
```

## Available Plugins

TrendyMC includes the following plugins:

- **accordion** - Create accordion/collapsible content sections
- **advlist** - Advanced list styles
- **anchor** - Insert anchors/bookmarks
- **autolink** - Automatically create links from URLs
- **autoresize** - Automatically resize editor to fit content
- **autosave** - Automatically save content
- **charmap** - Insert special characters
- **code** - Edit HTML source code
- **codesample** - Insert code samples with syntax highlighting
- **directionality** - Set text direction (LTR/RTL)
- **emoticons** - Insert emoticons/emojis
- **fullscreen** - Toggle fullscreen mode
- **help** - Display help dialog with keyboard shortcuts
- **image** - Insert and edit images
- **importcss** - Import CSS classes
- **insertdatetime** - Insert current date/time
- **link** - Insert and edit links
- **lists** - Enhanced list handling
- **media** - Embed media (video, audio)
- **nonbreaking** - Insert non-breaking spaces
- **pagebreak** - Insert page breaks
- **preview** - Preview content
- **quickbars** - Floating quick toolbar
- **save** - Save button functionality
- **searchreplace** - Find and replace text
- **table** - Insert and edit tables
- **visualblocks** - Show block-level elements
- **visualchars** - Show invisible characters
- **wordcount** - Display word and character count

## Themes and Skins

### UI Skins
- **oxide** - Modern, clean interface (light)
- **oxide-dark** - Dark mode variant
- **trendymc-5** - Classic TinyMCE 5 style
- **trendymc-5-dark** - Classic TinyMCE 5 dark style

### Content Skins
- **default** - Standard content styling
- **dark** - Dark content theme
- **document** - Document-like appearance
- **writer** - Writer-focused styling
- **trendymc-5** - Classic TinyMCE 5 content style
- **trendymc-5-dark** - Classic TinyMCE 5 dark content style

## Advanced Usage

### Accessing the Editor Instance

```javascript
// Initialize and store reference
const editor = trendymc.init({
    selector: '#editor',
    license_key: 'gpl',
    setup: function(editor) {
        editor.on('init', function() {
            console.log('Editor initialized');
        });
    }
});

// Access editor later
const editorInstance = trendymc.get('editor');
const content = editorInstance.getContent();
editorInstance.setContent('<p>New content</p>');
```

### Custom Buttons

```javascript
trendymc.init({
    selector: '#editor',
    license_key: 'gpl',
    setup: function(editor) {
        editor.ui.registry.addButton('myButton', {
            text: 'My Button',
            onAction: function() {
                editor.insertContent('&nbsp;<strong>Custom content!</strong>&nbsp;');
            }
        });
    },
    toolbar: 'myButton'
});
```

## Language Support

TrendyMC includes language files in the `js/trendymc/langs/` directory. To use a different language:

```javascript
trendymc.init({
    selector: '#editor',
    license_key: 'gpl',
    language: 'es' // Spanish
});
```

## API Reference

### Core Methods

- `trendymc.init(config)` - Initialize editor
- `trendymc.get(id)` - Get editor instance by ID
- `trendymc.remove(selector)` - Remove editor instance
- `trendymc.execCommand(cmd, ui, value)` - Execute command

### Editor Instance Methods

- `editor.getContent()` - Get editor content
- `editor.setContent(content)` - Set editor content
- `editor.insertContent(content)` - Insert content at cursor
- `editor.focus()` - Focus the editor
- `editor.save()` - Save content back to textarea
- `editor.destroy()` - Destroy editor instance

## Browser Support

TrendyMC supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Development

### Project Structure

```
Editor/
├── js/
│   └── trendymc/
│       ├── trendymc.min.js      # Core editor
│       ├── trendymc.d.ts        # TypeScript definitions
│       ├── plugins/             # Editor plugins
│       ├── themes/              # UI themes
│       ├── skins/               # UI and content skins
│       ├── icons/               # Icon packs
│       ├── models/              # Editor models
│       ├── langs/               # Language files
│       └── license.md           # License information
├── CHANGELOG.md                 # Version history
└── README.md                    # This file
```

## License

TrendyMC is licensed under the GNU General Public License Version 2 or later (GPL-2.0-or-later).

This is a rebranded version of TinyMCE, which is:
Copyright (c) 2024, Ephox Corporation DBA Tiny Technologies, Inc.

See `js/trendymc/license.md` for full license details.

## Attribution

TrendyMC is based on [TinyMCE](https://www.tiny.cloud/), a powerful rich text editor. This project maintains GPL compliance while offering a distinct branded identity.

## Author

Created by Rakibul Islam Morsalin
- [LinkedIn Profile](https://www.linkedin.com/in/rakibul-islam-morsalin-425855294/)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

For documentation and support, refer to:
- TinyMCE Documentation: https://www.tiny.cloud/docs/
- This README for TrendyMC-specific information

---

**Version:** 1.0
**Last Updated:** 2024
