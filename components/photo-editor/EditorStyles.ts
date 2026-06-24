export const EDITOR_STYLES = `
.editor-backdrop{position:fixed;inset:0;z-index:9999;padding:18px;display:grid;place-items:center;background:rgba(0,0,0,.78);backdrop-filter:blur(10px)}
.editor-panel{width:min(1040px,100%);max-height:96vh;overflow:auto;border-radius:22px;border:1px solid rgba(255,255,255,.16);background:#071014;padding:16px;box-shadow:0 30px 80px rgba(0,0,0,.45)}
.crop-panel{width:min(980px,100%)}
.editor-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:12px}
.editor-head strong{display:block;color:white;font-size:18px;margin-bottom:5px}
.editor-head p{margin:0;color:#cbd5e1;line-height:1.45}
.editor-close,.editor-actions button{min-height:42px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.08);color:white;padding:0 14px;font-weight:900;cursor:pointer}
.crop-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:#f3f4f6;touch-action:none;cursor:grab;display:block;user-select:none}
.crop-canvas.dragging{cursor:grabbing}
.blur-canvas{width:100%;height:auto;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(2,6,23,.78);touch-action:none;cursor:crosshair;display:block;user-select:none}
.zoom-control{display:grid;gap:8px;margin-top:14px;color:#e5e7eb;font-weight:900}
.zoom-control input{width:100%}
.nudge-controls{display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(3,44px);gap:6px;margin-top:14px;justify-content:center}
.nudge-btn{min-height:44px;width:44px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:rgba(255,255,255,.1);color:white;font-size:20px;cursor:pointer;display:grid;place-items:center;transition:background .15s}
.nudge-btn:hover{background:rgba(255,255,255,.22)}
.nudge-btn:active{background:rgba(255,255,255,.32)}
.nudge-center{grid-column:2;grid-row:2;font-size:14px}
.nudge-up{grid-column:2;grid-row:1}
.nudge-left{grid-column:1;grid-row:2}
.nudge-right{grid-column:3;grid-row:2}
.nudge-down{grid-column:2;grid-row:3}
.nudge-label{text-align:center;color:#94a3b8;font-size:12px;margin-top:4px}
.editor-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px}
.editor-actions button:disabled{opacity:.45;cursor:not-allowed}
.apply-blur{background:#22c55e!important;color:#052e16!important;border-color:transparent!important}
@media(max-width:560px){.editor-head{display:grid}.editor-actions button,.editor-close{width:100%}}
`;
