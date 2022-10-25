import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import ACTIONS from '../Actions';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ayu-dark.css';
import 'codemirror/mode/clike/clike';
// import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';


const Editor = ({socketRef, roomID, onCodeChange}) => {
    const editorRef=useRef(null); 
    useEffect(() => {
        async function init() {
            editorRef.current=Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: 'text/x-java',
                    // mode: { name: 'javascript', json: true },
                    theme: 'ayu-dark',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    matchtags: true,
                }
            );
            editorRef.current.on('change',(instance,changes)=>{
                const {origin}=changes;
                const code=instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomID, code, });
                }
            })
            editorRef.current.setValue(`public class Main
{
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
            );

        }
        console.log('================================')
        init();
    },[])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        // return () => {
        //     socketRef.current.off(ACTIONS.CODE_CHANGE);
        // };
    }, [socketRef.current]);

  return (
    <textarea id="realtimeEditor"></textarea>
  )
}

export default Editor