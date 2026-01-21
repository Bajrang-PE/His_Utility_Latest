import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Editor from '@monaco-editor/react';

const SQLEditor = React.memo(
  forwardRef((props, ref) => {
    const { setValues, values } = props;
    const editorRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getValue: () => editorRef.current?.getValue() || '',
      setValue: (value) => editorRef.current?.setValue(value || ''),
    }));

    const handleEditorDidMount = (editor) => {
      editorRef.current = editor;

      // set default only once
      editor.setValue(values?.query[0]?.mainQuery || 'SELECT * FROM users');
    };

    const handleEditorChange = (value) => {

      const dt = [
        {
          queryLabel: '1',
          mainQuery: value || '',
          isMultiRowDataTable: '',
          tableDataDisplay: 'horizontal',
          totalRecordCountQuery: '',
        },
      ];

      setValues((prev) => ({
        ...prev,
        query: dt,
      }));
    };

    return (
      <Editor
        height="350px"
        language="sql"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          overviewRulerLanes: 0,
          renderLineHighlight: 'none',
          tabSize: 2,
        }}
      />
    );
  })
);

export default SQLEditor;
