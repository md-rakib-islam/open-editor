const React = require('react');
const { useRef, useEffect, forwardRef, useImperativeHandle } = React;

/**
 * TrendyMC Editor Component for React
 * Compatible with TinyMCE React component API
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique ID for the editor instance
 * @param {string} props.initialValue - Initial content for the editor
 * @param {string} props.value - Controlled value (use with onChange/onEditorChange)
 * @param {Function} props.onInit - Callback when editor initializes (evt, editor)
 * @param {Function} props.onChange - Callback when content changes (modern API)
 * @param {Function} props.onEditorChange - Callback when content changes (TinyMCE API)
 * @param {Function} props.onBlur - Callback when editor loses focus
 * @param {Function} props.onFocus - Callback when editor gains focus
 * @param {string} props.placeholder - Placeholder text
 * @param {number} props.height - Editor height in pixels
 * @param {boolean} props.inline - Enable inline mode
 * @param {boolean} props.disabled - Disable the editor
 * @param {string} props.toolbar - Toolbar configuration
 * @param {Array} props.plugins - Array of plugin names
 * @param {Object} props.init - Additional TrendyMC init options
 */
const Editor = forwardRef(function Editor(props, ref) {
  const {
    id,
    initialValue = '',
    value,
    onInit,
    onChange,
    onEditorChange,
    onBlur,
    onFocus,
    placeholder,
    height = 500,
    inline = false,
    disabled = false,
    toolbar = 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    plugins = [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'preview', 'anchor', 'searchreplace', 'visualblocks',
      'code', 'fullscreen', 'insertdatetime', 'media', 'table',
      'help', 'wordcount'
    ],
    init = {}
  } = props;

  const elementRef = useRef(null);
  const editorRef = useRef(null);
  const isControlled = value !== undefined;

  // Support both onChange and onEditorChange
  const handleContentChange = onEditorChange || onChange;

  // Expose editor methods to parent via ref
  useImperativeHandle(ref, function() {
    return {
      getContent: function() {
        return editorRef.current ? editorRef.current.getContent() : '';
      },
      setContent: function(content) {
        if (editorRef.current) {
          editorRef.current.setContent(content);
        }
      },
      insertContent: function(content) {
        if (editorRef.current) {
          editorRef.current.insertContent(content);
        }
      },
      focus: function() {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      },
      getEditor: function() {
        return editorRef.current;
      }
    };
  });

  useEffect(function() {
    // Check if TrendyMC is available
    if (typeof window === 'undefined' || !window.trendymc) {
      console.error('TrendyMC is not loaded. Make sure to import the TrendyMC script.');
      return;
    }

    // Initialize TrendyMC
    const initConfig = {
      target: elementRef.current,
      license_key: 'gpl',
      height: height,
      inline: inline,
      disabled: disabled,
      toolbar: toolbar,
      plugins: plugins,
      menubar: init.menubar !== undefined ? init.menubar : true,
      statusbar: init.statusbar !== undefined ? init.statusbar : true,
      branding: init.branding !== undefined ? init.branding : false,
      placeholder: placeholder || init.placeholder,
      // Suppress plugin loading errors
      init_instance_callback: function(editor) {
        // Editor is now fully initialized
        editorRef.current = editor;
      }
    };

    // Merge additional init options
    for (var key in init) {
      if (init.hasOwnProperty(key)) {
        initConfig[key] = init[key];
      }
    }

    // Override setup to add our handlers
    const userSetup = init.setup;
    initConfig.setup = function(editor) {
      editorRef.current = editor;

      // Call user's setup if provided
      if (userSetup) {
        userSetup(editor);
      }

      // Handle initialization - TinyMCE passes (evt, editor)
      editor.on('init', function(evt) {
        if (onInit) {
          // Support TinyMCE-style (evt, editor) signature
          onInit(evt, editor);
        }
      });

      // Handle content changes
      editor.on('change keyup setcontent', function() {
        if (handleContentChange) {
          // TinyMCE passes (content, editor)
          handleContentChange(editor.getContent(), editor);
        }
      });

      // Handle blur event
      if (onBlur) {
        editor.on('blur', function(evt) {
          onBlur(evt, editor);
        });
      }

      // Handle focus event
      if (onFocus) {
        editor.on('focus', function(evt) {
          onFocus(evt, editor);
        });
      }
    };

    window.trendymc.init(initConfig);

    // Cleanup on unmount
    return function() {
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, []); // Only run on mount

  // Handle controlled component updates
  useEffect(function() {
    if (isControlled && editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value, isControlled]);

  // Handle disabled state changes
  useEffect(function() {
    if (editorRef.current) {
      // Check if mode API exists
      if (editorRef.current.mode && editorRef.current.mode.set) {
        editorRef.current.mode.set(disabled ? 'readonly' : 'design');
      } else if (editorRef.current.getBody) {
        // Fallback: set contenteditable directly
        var body = editorRef.current.getBody();
        if (body) {
          body.setAttribute('contenteditable', disabled ? 'false' : 'true');
        }
      }
    }
  }, [disabled]);

  // Render textarea or div based on inline mode
  if (inline) {
    return React.createElement('div', {
      ref: elementRef,
      id: id,
      dangerouslySetInnerHTML: { __html: initialValue }
    });
  }

  return React.createElement('textarea', {
    ref: elementRef,
    id: id,
    defaultValue: initialValue,
    style: { visibility: 'hidden' }
  });
});

Editor.displayName = 'TrendyMCEditor';

module.exports = Editor;
