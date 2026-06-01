import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

/**
 * TrendyMC Editor Component for React
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique ID for the editor instance
 * @param {string} props.initialValue - Initial content for the editor
 * @param {string} props.value - Controlled value (use with onChange)
 * @param {Function} props.onInit - Callback when editor initializes
 * @param {Function} props.onChange - Callback when content changes
 * @param {Function} props.onBlur - Callback when editor loses focus
 * @param {Function} props.onFocus - Callback when editor gains focus
 * @param {number} props.height - Editor height in pixels
 * @param {boolean} props.inline - Enable inline mode
 * @param {boolean} props.disabled - Disable the editor
 * @param {string} props.toolbar - Toolbar configuration
 * @param {Array} props.plugins - Array of plugin names
 * @param {Object} props.init - Additional TrendyMC init options
 */
const Editor = forwardRef((props, ref) => {
  const {
    id,
    initialValue = '',
    value,
    onInit,
    onChange,
    onBlur,
    onFocus,
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

  // Expose editor methods to parent via ref
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent() || '',
    setContent: (content) => editorRef.current?.setContent(content),
    insertContent: (content) => editorRef.current?.insertContent(content),
    focus: () => editorRef.current?.focus(),
    getEditor: () => editorRef.current,
  }));

  useEffect(() => {
    // Check if TrendyMC is available
    if (typeof window === 'undefined' || !window.trendymc) {
      console.error('TrendyMC is not loaded. Make sure to import the TrendyMC script.');
      return;
    }

    // Initialize TrendyMC
    const initConfig = {
      target: elementRef.current,
      license_key: 'gpl',
      height,
      inline,
      disabled,
      toolbar,
      plugins,
      menubar: init.menubar !== undefined ? init.menubar : true,
      statusbar: init.statusbar !== undefined ? init.statusbar : true,
      branding: init.branding !== undefined ? init.branding : false,
      ...init,
      setup: (editor) => {
        editorRef.current = editor;

        // Call user's setup if provided
        if (init.setup) {
          init.setup(editor);
        }

        // Handle initialization
        editor.on('init', () => {
          if (onInit) {
            onInit(editor);
          }
        });

        // Handle content changes
        editor.on('change keyup setcontent', () => {
          if (onChange) {
            onChange(editor.getContent(), editor);
          }
        });

        // Handle blur event
        if (onBlur) {
          editor.on('blur', () => {
            onBlur(editor);
          });
        }

        // Handle focus event
        if (onFocus) {
          editor.on('focus', () => {
            onFocus(editor);
          });
        }
      }
    };

    window.trendymc.init(initConfig);

    // Cleanup on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, []); // Only run on mount

  // Handle controlled component updates
  useEffect(() => {
    if (isControlled && editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value, isControlled]);

  // Handle disabled state changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setMode(disabled ? 'readonly' : 'design');
    }
  }, [disabled]);

  // Render textarea or div based on inline mode
  if (inline) {
    return (
      <div
        ref={elementRef}
        id={id}
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
    );
  }

  return (
    <textarea
      ref={elementRef}
      id={id}
      defaultValue={initialValue}
      style={{ visibility: 'hidden' }}
    />
  );
});

Editor.displayName = 'TrendyMCEditor';

export default Editor;
